'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _http = require('http');

var startServer = function startServer(server) {
  return new Promise(function (resolve, reject) {
    server.start(0, function () {
      return resolve(server.info.port);
    });
  });
};

var sendRequest = function sendRequest(_ref) {
  var port = _ref.port;
  var method = _ref.method;
  var path = _ref.path;
  var payload = _ref.payload;

  return new Promise(function (resolve, reject) {
    var options = { hostname: 'localhost', port: port, path: path, method: method };

    if (payload) {
      payload = JSON.stringify(payload);
      options.headers = {
        'content-type': 'application/json',
        'content-length': payload.length
      };
    }

    (0, _http.request)(options, function (res) {
      var json = '';
      res.setEncoding('utf8');
      res.on('data', function (data) {
        return json += data;
      });
      res.on('end', function () {
        try {
          resolve(JSON.parse(json));
        } catch (err) {
          reject(err);
        }
      });
    }).end(payload);
  });
};

var test = function test(_ref2) {
  var server = _ref2.server;
  var method = _ref2.method;
  var path = _ref2.path;
  var payload = _ref2.payload;

  return new Promise(function (resolve, reject) {
    Promise.resolve(server).then(function (server) {
      return startServer(server);
    }).then(function (port) {
      return sendRequest({ port: port, method: method, path: path, payload: payload });
    }).then(resolve).then(function () {
      return server.stop();
    })['catch'](reject);
  });
};

exports['default'] = test;
module.exports = exports['default'];