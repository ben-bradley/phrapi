'use strict';

import querystring from './querystring';
import processPayload from './payload';
import params from './params';
import Errors from './errors';
import util from 'util';

const headers = {
  'Content-Type': 'application/json'
};

const validate = (obj) => {
  if (!util.isObject(obj))
    throw new Error('Flow handlers must resolve an object: ' + obj);

  return obj;
};

const respond = (response, code, json) => {
  response.writeHead(code, headers);
  response.end(JSON.stringify(json));
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

const decorate = (request, route) => new Promise((resolve, reject) => {
  // parse querystring to .query
  request.query = querystring(request.url);

  // extract params from the path to .params
  request.params = params(request.url, route);

  // collect payload data on .payload
  processPayload(request)
    .then((payload) => request.payload = payload)
    .then(() => resolve({}))
    .catch(reject);
});

const coerceError = (response, err) => {
  if (!err)
    err = Errors.internalError('Unknown error');
  else if (!err._phrapiError)
    err = Errors.internalError(err.message || err);

  err._phrapiError = undefined;

  let reply = {
    code: err.code,
    error: err.error.message
  };

  return respond(response, err.code, reply);
}

const Handler = ({ router } = {}) => {
  if (!router)
    throw new Error('router not provided to Handler()');

  return (request, response) => {
    let { method, url } = request,
      route = router.find(method, url);

    request.resolved = {};

    if (!route)
      return respond(response, 404, Errors.notFound(method + ' ' + url));

    route.flow.reduce((promise, handler) => promise
      .then(obj => validate(obj))
      .then(obj => Object.assign(request.resolved, obj))
      .then(() => wrap(handler, request)), decorate(request, route))
    .then(obj => validate(obj))
    .then(reply => respond(response, 200, reply))
    .catch(err => coerceError(response, err));
  };
};

export default Handler;
