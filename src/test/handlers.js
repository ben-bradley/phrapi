'use strict';

import Errors from '../errors';

export default {

  foo(request, resolve, reject) {
    resolve({ foo: 'bar' });
  },

  bar(request, resolve, reject) {
    let { params, query, resolved, payload } = request,
      { foo } = resolved;

    resolve({ bar: 'baz', foo });
  },

  decorate(request, resolve, reject) {
    let { params, query, resolved, payload } = request;

    resolve({ params, query, resolved, payload });
  },

  parallel(request, resolve, reject) {
    let { params, query, resolved, payload } = request;

    resolve({ parallel: true, resolved });
  },

  badRequest(request, resolve, reject) {
    reject(Errors.badRequest('Bad Request'));
  },

  error(request, resolve, reject) {
    reject(new Error('foobar'));
  },

  rejector(request, resolve, reject) {
    reject('foobar');
  },

  rejectNoArgs(request, resolve, reject) {
    reject();
  },

  customHeaders(request, resolve, reject) {
    let { reply } = request;

    reply.headers['x-custom'] = 'blargh';

    resolve(Object.assign({}, request.resolved));
  }

};
