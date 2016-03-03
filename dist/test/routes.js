'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _handlers = require('./handlers');

exports['default'] = [{
  method: 'get',
  path: '/foo',
  flow: [_handlers.foo]
}, {
  method: 'get',
  path: '/bar',
  flow: [_handlers.foo, _handlers.bar]
}, {
  method: 'post',
  path: '/decorate/{foo}',
  flow: [_handlers.foo, _handlers.bar, _handlers.decorate]
}, {
  method: 'get',
  path: '/parallel',
  flow: [[_handlers.bar, _handlers.foo], _handlers.parallel]
}, {
  method: 'get',
  path: '/badRequest',
  flow: [_handlers.badRequest]
}, {
  method: 'get',
  path: '/error',
  flow: [_handlers.error]
}, {
  method: 'get',
  path: '/rejector',
  flow: [_handlers.rejector]
}, {
  method: 'get',
  path: '/rejectNoArgs',
  flow: [_handlers.rejectNoArgs]
}, {
  method: 'get',
  path: '/customHeaders',
  flow: [_handlers.foo, _handlers.customHeaders]
}, {
  method: 'get',
  path: '/resolveNoObject',
  flow: [_handlers.resolveNoObject]
}];
module.exports = exports['default'];