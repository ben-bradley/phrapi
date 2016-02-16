'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _handler = require('./handler');

var _handler2 = _interopRequireDefault(_handler);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var server = _http2['default'].createServer(_handler2['default']);

exports['default'] = {
  start: function start(port, callback) {
    server.listen(port, callback);
  },
  route: function route(options) {
    var method = options.method;
    var path = options.path;
    var handler = options.handler;

    _router2['default'].route(options);
  }
};
module.exports = exports['default'];