'use strict';

import { bar, foo, baz, postfoo, bail, qux } from './handlers';

export default [{
  method: 'get',
  path: '/foo/{id}/{bar}',
  flow: [ bar, foo, baz ]
}, {
  method: 'get',
  path: '/foo/{bar}',
  flow: [ foo ]
}, {
  method: 'post',
  path: '/foo',
  flow: [ postfoo ]
}, {
  method: 'post',
  path: '/bail',
  flow: [ bail ]
}, {
  method: 'get',
  path: '/all',
  flow: [ qux, [ foo, baz ] ]
}];
