'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {

  foo: function foo(request, resolve, reject) {
    console.log('foo');
    var params = request.params;
    var query = request.query;
    var resolved = request.resolved;
    var payload = request.payload;

    resolve({ foo: 'bar', params: params, query: query, resolved: resolved });
  },

  bar: function bar(request, resolve, reject) {
    console.log('bar');
    resolve({ bar: 'baz' });
  },

  baz: function baz(request, resolve, reject) {
    console.log('baz');
    setTimeout(function () {
      resolve({ bar: 'foo' });
    }, 1000);
  },

  qux: function qux(request, resolve, reject) {
    console.log('qux');
    setTimeout(function () {
      resolve({ qux: 'honk' });
    }, 2000);
  },

  bail: function bail(request, resolve, reject) {
    console.log('bail');
    reject({ code: 400, message: 'bail out!' });
  },

  postfoo: function postfoo(request, resolve, reject) {
    console.log('postfoo: ', request.payload);
    resolve({ payload: request.payload });
  }

};
module.exports = exports['default'];