'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _errors = require('../errors');

var _errors2 = _interopRequireDefault(_errors);

exports['default'] = {

  foo: function foo(request, resolve, reject) {
    resolve({ foo: 'bar' });
  },

  bar: function bar(request, resolve, reject) {
    var params = request.params;
    var query = request.query;
    var resolved = request.resolved;
    var payload = request.payload;
    var foo = resolved.foo;

    resolve({ bar: 'baz', foo: foo });
  },

  decorate: function decorate(request, resolve, reject) {
    var params = request.params;
    var query = request.query;
    var resolved = request.resolved;
    var payload = request.payload;

    resolve({ params: params, query: query, resolved: resolved, payload: payload });
  },

  parallel: function parallel(request, resolve, reject) {
    var params = request.params;
    var query = request.query;
    var resolved = request.resolved;
    var payload = request.payload;

    resolve({ parallel: true, resolved: resolved });
  },

  resolveNoObject: function resolveNoObject(request, resolve, reject) {
    resolve();
  },

  badRequest: function badRequest(request, resolve, reject) {
    reject(_errors2['default'].badRequest('Bad Request'));
  },

  error: function error(request, resolve, reject) {
    reject(new Error('foobar'));
  },

  rejector: function rejector(request, resolve, reject) {
    reject('foobar');
  },

  rejectNoArgs: function rejectNoArgs(request, resolve, reject) {
    reject();
  },

  customHeaders: function customHeaders(request, resolve, reject) {
    var reply = request.reply;

    reply.headers['x-custom'] = 'blargh';

    resolve(Object.assign({}, request.resolved));
  }

};
module.exports = exports['default'];