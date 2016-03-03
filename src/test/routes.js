'use strict';

import {
  bar,
  foo,
  decorate,
  parallel,
  badRequest,
  error,
  rejector,
  rejectNoArgs,
  customHeaders,
  resolveNoObject
} from './handlers';

export default [{
  method: 'get',
  path: '/foo',
  flow: [ foo ]
}, {
  method: 'get',
  path: '/bar',
  flow: [ foo, bar ]
}, {
  method: 'post',
  path: '/decorate/{foo}',
  flow: [ foo, bar, decorate ]
}, {
  method: 'get',
  path: '/parallel',
  flow: [ [ bar, foo ], parallel ]
}, {
  method: 'get',
  path: '/badRequest',
  flow: [ badRequest ]
}, {
  method: 'get',
  path: '/error',
  flow: [ error ]
}, {
  method: 'get',
  path: '/rejector',
  flow: [ rejector ]
}, {
  method: 'get',
  path: '/rejectNoArgs',
  flow: [ rejectNoArgs ]
}, {
  method: 'get',
  path: '/customHeaders',
  flow: [ foo, customHeaders ]
}, {
  method: 'get',
  path: '/resolveNoObject',
  flow: [ resolveNoObject ]
}];
