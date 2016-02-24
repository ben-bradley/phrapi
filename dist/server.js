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

var Server = function Server() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$router = _ref.router;
  var router = _ref$router === undefined ? new _router2['default']() : _ref$router;

  var handler = new _handler2['default']({ router: router }),
      _server = _http2['default'].createServer(handler);

  var server = {
    start: function start(port, callback) {
      port = port || 0;

      _server.listen(port, function () {
        server.info = {
          port: _server.address().port
        };

        if (callback) return callback();
      });
    },
    route: function route(_route) {
      router.route(_route);
    },
    router: router
  };

  return server;
};

exports['default'] = Server;
module.exports = exports['default'];