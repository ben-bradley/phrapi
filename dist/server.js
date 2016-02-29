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

var _test2 = require('./test');

var _test3 = _interopRequireDefault(_test2);

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
    stop: function stop(callback) {
      _server.close(callback);
    },
    route: function route(_route) {
      router.route(_route);
    },
    test: function test(_ref2) {
      var method = _ref2.method;
      var path = _ref2.path;
      var payload = _ref2.payload;

      return (0, _test3['default'])({ server: server, method: method, path: path, payload: payload });
    },
    router: router
  };

  return server;
};

exports['default'] = Server;
module.exports = exports['default'];