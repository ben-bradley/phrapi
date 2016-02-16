'use strict';

import api from './index';

const foo = (request, resolve, reject) => {
  console.log('foo');
  resolve({ foo: 'bar' });
};

const bar = (request, resolve, reject) => {
  console.log('bar');
  resolve({ bar: 'baz' });
};

const baz = (request, resolve, reject) => {
  console.log('baz');
  resolve({ bar: 'foo' });
};

const bail = (request, resolve, reject) => {
  console.log('bail');
  reject({ code: 400, message: 'bail out!' });
};

api.route({
  method: 'get',
  path: '/foo/{id}/{bar}',
  flow: [ bar, foo, baz ]
});

api.route({
  method: 'get',
  path: '/foo/{foo}/{bra}/boo',
  flow: [bail]
});

api.route({
  method: 'get',
  path: '/bail',
  flow: [bail]
});

api.start(3000, (err) => {
  if (err)
    throw err;

  console.log('listening...');
});
