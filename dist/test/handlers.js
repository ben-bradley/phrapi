'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _errors = require('../errors');

var _errors2 = _interopRequireDefault(_errors);

exports['default'] = {

  foo: function foo(ctx, resolve, reject) {
    resolve({ foo: 'bar' });
  },

  bar: function bar(ctx, resolve, reject) {
    var params = ctx.params;
    var query = ctx.query;
    var resolved = ctx.resolved;
    var payload = ctx.payload;
    var foo = resolved.foo;

    resolve({ bar: 'baz', foo: foo });
  },

  decorate: function decorate(ctx, resolve, reject) {
    var params = ctx.params;
    var query = ctx.query;
    var resolved = ctx.resolved;
    var payload = ctx.payload;

    resolve({ params: params, query: query, resolved: resolved, payload: payload });
  },

  parallel: function parallel(ctx, resolve, reject) {
    var params = ctx.params;
    var query = ctx.query;
    var resolved = ctx.resolved;
    var payload = ctx.payload;

    resolve({ parallel: true, resolved: resolved });
  },

  resolveNoObject: function resolveNoObject(ctx, resolve, reject) {
    resolve();
  },

  badRequest: function badRequest(ctx, resolve, reject) {
    reject(_errors2['default'].badRequest('Bad Request'));
  },

  error: function error(ctx, resolve, reject) {
    reject(new Error('foobar'));
  },

  rejector: function rejector(ctx, resolve, reject) {
    reject('foobar');
  },

  rejectNoArgs: function rejectNoArgs(ctx, resolve, reject) {
    reject();
  },

  customHeaders: function customHeaders(ctx, resolve, reject) {
    var reply = ctx.reply;

    reply.headers['x-custom'] = 'blargh';

    resolve(Object.assign({}, ctx.resolved));
  }

};
module.exports = exports['default'];