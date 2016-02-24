'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

var Phrapi = { Server: _server2['default'], Router: _router2['default'], Errors: _errors2['default'] };

exports['default'] = Phrapi;
module.exports = exports['default'];