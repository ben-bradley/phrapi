'use strict';

export default {

  foo(request, resolve, reject) {
    console.log('foo');
    let { params, query, resolved, payload } = request;
    resolve({ foo: 'bar', params, query, resolved });
  },

  bar(request, resolve, reject) {
    console.log('bar');
    resolve({ bar: 'baz' });
  },

  baz(request, resolve, reject) {
    console.log('baz');
    setTimeout(() => {
      resolve({ bar: 'foo' });
    }, 1000);
  },

  qux(request, resolve, reject) {
    console.log('qux');
    setTimeout(() => {
      resolve({ qux: 'honk' });
    }, 2000);
  },

  bail(request, resolve, reject) {
    console.log('bail');
    reject({ code: 400, message: 'bail out!' });
  },

  postfoo(request, resolve, reject) {
    console.log('postfoo: ', request.payload);
    resolve({ payload: request.payload });
  },

  ping(request, resolve, reject) {
    resolve({ pong: new Date() });
  }

};
