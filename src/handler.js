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
  if (obj === undefined)
    return {};

  if (!util.isObject(obj))
    throw new Error('Flow handlers must resolve an object: ' + obj);

  return obj;
};

const respond = (ctx) => {
  let { response, reply } = ctx,
    { code, headers, payload } = reply;

  response.writeHead(code, headers);
  response.end(JSON.stringify(payload));
};

const wrap = (handler, ctx) => {
  if (typeof handler === 'function')
    return new Promise((resolve, reject) => handler(ctx, resolve, reject));

  else if (util.isArray(handler))
    return new Promise((resolve, reject) => // wrap Promise.all in a promise
      Promise.all(handler.map((handler) =>
        new Promise((_resolve, _reject) => handler(ctx, _resolve, _reject))
      ))
      .then((results) => // when .all() is done, resolve the returned promise
        resolve(results.reduce((obj, result) => Object.assign(obj, result), {})))
      .catch(reject));
};

const decorate = (ctx, route) =>
  new Promise((resolve, reject) => {
    // parse querystring to .query
    ctx.query = querystring(ctx.request.url);

    // extract params from the path to .params
    if (route)
      ctx.params = params(ctx.request.url, route);

    // build the resolved accumulator
    ctx.resolved = {};

    // build the reply object
    ctx.reply = {
      headers: Object.assign({}, defaultHeaders),
      code: 200,
      payload: {}
    };

    // collect payload data on .payload
    processPayload(ctx.request)
      .then((payload) => ctx.payload = payload)
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

    let ctx = { request, response };

    flow.reduce((promise, handler) => promise
      .then(obj => validate(obj))
      .then(obj => Object.assign(ctx.resolved, obj))
      .then(() => wrap(handler, ctx)), decorate(ctx, route))
    .then(obj => validate(obj))
    .then(obj => Object.assign(ctx.reply.payload, obj))
    .then(() => respond(ctx))
    .catch(err => respond(coerceError(ctx, err)));
  };
};

export default Handler;
