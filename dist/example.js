'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var foo = function foo(request, resolve, reject) {
  console.log('foo');
  resolve({ foo: 'bar' });
};

var bar = function bar(request, resolve, reject) {
  console.log('bar');
  resolve({ bar: 'baz' });
};

var baz = function baz(request, resolve, reject) {
  console.log('baz');
  resolve({ bar: 'foo' });
};

var bail = function bail(request, resolve, reject) {
  console.log('bail');
  reject({ code: 400, message: 'bail out!' });
};

_index2['default'].route({
  method: 'get',
  path: '/foo/{id}/{bar}',
  flow: [bar, foo, baz]
});

_index2['default'].route({
  method: 'get',
  path: '/foo/{foo}/{bra}/boo',
  flow: [bail]
});

_index2['default'].route({
  method: 'get',
  path: '/bail',
  flow: [bail]
});

_index2['default'].start(3000, function (err) {
  if (err) throw err;

  console.log('listening...');
});