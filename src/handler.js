'use strict';

import querystring from './querystring';
import processPayload from './payload';
import params from './params';
import Errors from './errors';
import util from 'util';

const defaultHeaders = {
  'Content-Type': 'application/json'
};

const validate = (obj) => {
  if (!util.isObject(obj))
    throw new Error('Flow handlers must resolve an object: ' + obj);

  return obj;
};

const respond = (request) => {
  let { reply } = request,
    { response, code, headers, payload } = reply;

  response.writeHead(code, headers);
  response.end(JSON.stringify(payload));
};

const wrap = (handler, request) => {
  if (typeof handler === 'function')
    return new Promise((resolve, reject) => handler(request, resolve, reject));

  else if (util.isArray(handler))
    return new Promise((resolve, reject) => // wrap Promise.all in a promise
      Promise.all(handler.map((handler) =>
        new Promise((_resolve, _reject) => handler(request, _resolve, _reject))
      ))
      .then((results) => // when .all() is done, resolve the returned promise
        resolve(results.reduce((obj, result) => Object.assign(obj, result), {})))
      .catch(reject));
};

const decorate = (request, response, route) =>
  new Promise((resolve, reject) => {
    // parse querystring to .query
    request.query = querystring(request.url);

    // extract params from the path to .params
    if (route)
      request.params = params(request.url, route);

    // build the resolved accumulator
    request.resolved = {};

    // build the reply object
    request.reply = {
      response,
      headers: Object.assign({}, defaultHeaders),
      code: 200,
      payload: {}
    };

    // collect payload data on .payload
    processPayload(request)
      .then((payload) => request.payload = payload)
      .then(() => resolve({}))
      .catch(reject);
  });

const coerceError = (request, err) => {
  if (!err)
    err = Errors.internalError('Unknown error, something was rejected');
  else if (!err._phrapiError)
    err = Errors.internalError(err.message || err);

  let { code, error } = err;

  request.reply.code = err.code;
  request.reply.payload = { code, error: error.message };

  return request;
};

const notFound = (request, resolve, reject) => {
  reject(Errors.notFound());
};

const Handler = ({ router } = {}) => {
  if (!router)
    throw new Error('router not provided to Handler()');

  return (request, response) => {
    let { method, url } = request,
      route = router.find(method, url),
      flow = (route) ? route.flow : [ notFound ];

    flow.reduce((promise, handler) => promise
      .then(obj => validate(obj))
      .then(obj => Object.assign(request.resolved, obj))
      .then(() => wrap(handler, request)), decorate(request, response, route))
    .then(obj => validate(obj))
    .then(obj => Object.assign(request.reply.payload, obj))
    .then(() => respond(request))
    .catch(err => respond(coerceError(request, err)));
  };
};

export default Handler;
