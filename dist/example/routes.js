'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _handlers = require('./handlers');

exports['default'] = [{
  method: 'get',
  path: '/foo/{id}/{bar}',
  flow: [_handlers.bar, _handlers.foo, _handlers.baz]
}, {
  method: 'get',
  path: '/foo/{bar}',
  flow: [_handlers.foo]
}, {
  method: 'post',
  path: '/foo',
  flow: [_handlers.postfoo]
}, {
  method: 'post',
  path: '/bail',
  flow: [_handlers.bail]
}, {
  method: 'get',
  path: '/all',
  flow: [_handlers.qux, [_handlers.foo, _handlers.baz]]
}, {
  method: 'get',
  path: '/ping',
  flow: [_handlers.ping]
}];
module.exports = exports['default'];