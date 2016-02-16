'use strict';

import querystring from './querystring';
import router from './router';
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
  response.writeHead(code || 500, headers);
  response.end(JSON.stringify(json));
};

const wrapHandler = (handler, request) =>
  new Promise((resolve, reject) => handler(request, resolve, reject));

const handler = (request, response) => {
  let { method, url } = request,
    query = querystring(url),
    route = router.find(method, url),
    reply = {};

  if (!route)
    return respond(response, 404, { code: 404, method, url });

  route.flow.reduce((promise, handler) => promise
    .then(validate)
    .then(obj => Object.assign(reply, obj))
    .then(reply => wrapHandler(handler, request)), Promise.resolve(reply))
  .then(validate)
  .then(obj => Object.assign(reply, obj))
  .then(reply => respond(response, 200, reply))
  .catch(error => respond(response, error.code, error));
};

export default handler;
