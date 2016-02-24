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

var headers = {
  'Content-Type': 'application/json'
};

var validate = function validate(obj) {
  if (!_util2['default'].isObject(obj)) throw new Error('Flow handlers must resolve an object: ' + obj);

  return obj;
};

var respond = function respond(response, code, json) {
  response.writeHead(code, headers);
  response.end(JSON.stringify(json));
};

var wrap = function wrap(handler, request) {
  if (typeof handler === 'function') return new Promise(function (resolve, reject) {
    return handler(request, resolve, reject);
  });else if (_util2['default'].isArray(handler)) return new Promise(function (resolve, reject) {
    return (// wrap Promise.all in a promise
      Promise.all(handler.map(function (handler) {
        return new Promise(function (_resolve, _reject) {
          return handler(request, _resolve, _reject);
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

var decorate = function decorate(request, route) {
  return new Promise(function (resolve, reject) {
    // parse querystring to .query
    request.query = (0, _querystring2['default'])(request.url);

    // extract params from the path to .params
    request.params = (0, _params2['default'])(request.url, route);

    // collect payload data on .payload
    (0, _payload2['default'])(request).then(function (payload) {
      return request.payload = payload;
    }).then(function () {
      return resolve({});
    })['catch'](reject);
  });
};

var coerceError = function coerceError(response, err) {
  if (!err) err = _errors2['default'].internalError('Unknown error');else if (!err._phrapiError) err = _errors2['default'].internalError(err.message || err);

  err._phrapiError = undefined;

  var reply = {
    code: err.code,
    error: err.error.message
  };

  return respond(response, err.code, reply);
};

var Handler = function Handler() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var router = _ref.router;

  if (!router) throw new Error('router not provided to Handler()');

  return function (request, response) {
    var method = request.method;
    var url = request.url;
    var route = router.find(method, url);

    request.resolved = {};

    if (!route) return respond(response, 404, _errors2['default'].notFound(method + ' ' + url));

    route.flow.reduce(function (promise, handler) {
      return promise.then(function (obj) {
        return validate(obj);
      }).then(function (obj) {
        return Object.assign(request.resolved, obj);
      }).then(function () {
        return wrap(handler, request);
      });
    }, decorate(request, route)).then(function (obj) {
      return validate(obj);
    }).then(function (reply) {
      return respond(response, 200, reply);
    })['catch'](function (err) {
      return coerceError(response, err);
    });
  };
};

exports['default'] = Handler;
module.exports = exports['default'];