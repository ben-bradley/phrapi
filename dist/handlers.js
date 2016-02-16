'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _querystring = require('./querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var headers = {
  'Content-Type': 'application/json'
};

var validate = function validate(obj) {
  if (!_util2['default'].isObject(obj)) throw new Error('Flow handlers must resolve an object: ' + obj);

  return obj;
};

var respond = function respond(response, code, json) {
  response.writeHead(code || 500, headers);
  response.end(JSON.stringify(json));
};

var wrapHandler = function wrapHandler(handler, request) {
  return new Promise(function (resolve, reject) {
    return handler(request, resolve, reject);
  });
};

var handler = function handler(request, response) {
  var method = request.method;
  var url = request.url;
  var query = (0, _querystring2['default'])(url);
  var route = _router2['default'].find(method, url);
  var reply = {};

  if (!route) return respond(response, 404, { code: 404, method: method, url: url });

  route.flow.reduce(function (promise, handler) {
    return promise.then(validate).then(function (obj) {
      return Object.assign(reply, obj);
    }).then(function (reply) {
      return wrapHandler(handler, request);
    });
  }, Promise.resolve(reply)).then(validate).then(function (obj) {
    return Object.assign(reply, obj);
  }).then(function (reply) {
    return respond(response, 200, reply);
  })['catch'](function (error) {
    return respond(response, error.code, error);
  });
};

exports['default'] = handler;
module.exports = exports['default'];