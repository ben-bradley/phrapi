'use strict';

import Errors from '../errors';

export default {

  foo(ctx, resolve, reject) {
    resolve({ foo: 'bar' });
  },

  bar(ctx, resolve, reject) {
    let { params, query, resolved, payload } = ctx,
      { foo } = resolved;

    resolve({ bar: 'baz', foo });
  },

  decorate(ctx, resolve, reject) {
    let { params, query, resolved, payload } = ctx;

    resolve({ params, query, resolved, payload });
  },

  parallel(ctx, resolve, reject) {
    let { params, query, resolved, payload } = ctx;

    resolve({ parallel: true, resolved });
  },

  resolveNoObject(ctx, resolve, reject) {
    resolve();
  },

  badRequest(ctx, resolve, reject) {
    reject(Errors.badRequest('Bad Request'));
  },

  error(ctx, resolve, reject) {
    reject(new Error('foobar'));
  },

  rejector(ctx, resolve, reject) {
    reject('foobar');
  },

  rejectNoArgs(ctx, resolve, reject) {
    reject();
  },

  customHeaders(ctx, resolve, reject) {
    let { reply } = ctx;

    reply.headers['x-custom'] = 'blargh';

    resolve(Object.assign({}, ctx.resolved));
  }

};
