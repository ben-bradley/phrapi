'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _querystring = require('./querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _payload = require('./payload');

var _payload2 = _interopRequireDefault(_payload);

var _params = require('./params');

var _params2 = _interopRequireDefault(_params);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var defaultHeaders = {
  'Content-Type': 'application/json'
};

var validate = function validate(obj) {
  if (obj === undefined) return {};

  if (!_util2['default'].isObject(obj)) throw new Error('Flow handlers must resolve an object: ' + obj);

  return obj;
};

var respond = function respond(ctx) {
  var response = ctx.response;
  var reply = ctx.reply;
  var code = reply.code;
  var headers = reply.headers;
  var payload = reply.payload;

  response.writeHead(code, headers);
  response.end(JSON.stringify(payload));
};

var wrap = function wrap(handler, ctx) {
  if (typeof handler === 'function') return new Promise(function (resolve, reject) {
    return handler(ctx, resolve, reject);
  });else if (_util2['default'].isArray(handler)) return new Promise(function (resolve, reject) {
    return (// wrap Promise.all in a promise
      Promise.all(handler.map(function (handler) {
        return new Promise(function (_resolve, _reject) {
          return handler(ctx, _resolve, _reject);
        });
      })).then(function (results) {
        return (// when .all() is done, resolve the returned promise
          resolve(results.reduce(function (obj, result) {
            return Object.assign(obj, result);
          }, {}))
        );
      })['catch'](reject)
    );
  });
};

var decorate = function decorate(ctx, route) {
  return new Promise(function (resolve, reject) {
    // parse querystring to .query
    ctx.query = (0, _querystring2['default'])(ctx.request.url);

    // extract params from the path to .params
    if (route) ctx.params = (0, _params2['default'])(ctx.request.url, route);

    // build the resolved accumulator
    ctx.resolved = {};

    // build the reply object
    ctx.reply = {
      headers: Object.assign({}, defaultHeaders),
      code: 200,
      payload: {}
    };

    // collect payload data on .payload
    (0, _payload2['default'])(ctx.request).then(function (payload) {
      return ctx.payload = payload;
    }).then(function () {
      return resolve({});
    })['catch'](reject);
  });
};

var coerceError = function coerceError(request, err) {
  if (!err) err = _errors2['default'].internalError('Unknown error, something was rejected');else if (!err._phrapiError) err = _errors2['default'].internalError(err.message || err);

  var _err = err;
  var code = _err.code;
  var error = _err.error;

  request.reply.code = err.code;
  request.reply.payload = { code: code, error: error.message };

  return request;
};

var notFound = function notFound(request, resolve, reject) {
  reject(_errors2['default'].notFound());
};

var Handler = function Handler() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var router = _ref.router;

  if (!router) throw new Error('router not provided to Handler()');

  return function (request, response) {
    var method = request.method;
    var url = request.url;
    var route = router.find(method, url);
    var flow = route ? route.flow : [notFound];

    var ctx = { request: request, response: response };

    flow.reduce(function (promise, handler) {
      return promise.then(function (obj) {
        return validate(obj);
      }).then(function (obj) {
        return Object.assign(ctx.resolved, obj);
      }).then(function () {
        return wrap(handler, ctx);
      });
    }, decorate(ctx, route)).then(function (obj) {
      return validate(obj);
    }).then(function (obj) {
      return Object.assign(ctx.reply.payload, obj);
    }).then(function () {
      return respond(ctx);
    })['catch'](function (err) {
      return respond(coerceError(ctx, err));
    });
  };
};

exports['default'] = Handler;
module.exports = exports['default'];