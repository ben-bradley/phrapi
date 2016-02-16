'use strict';

const routes = [];

const buildFingerprint = (path, params) =>  {
  return '^' + params.reduce((path, param) => {
    return path.replace(param, '([^\/\?]+?)');
  }, path) + '$';
};

export default {
  route(options) {
    let { path , method, flow } = options,
      _params = path.match(/\{(.+?)\}/g) || [],
      params = _params.map(p => p.replace(/[\{\}]/g, '')),
      fingerprint = buildFingerprint(path, _params),
      regex = new RegExp(fingerprint);

    method = method.toLowerCase();

    let exists = routes.filter(r => r.method === method && r.fingerprint === fingerprint);

    if (exists.length) {
      let existing = exists[0].method.toUpperCase() + ' ' + exists[0].path,
        duplicate = method.toUpperCase() + ' ' + path;

      throw new Error('Route exists. Duplicate: ' + duplicate + ', Existing: ' + existing);
    }

    let route = { method, path, flow, params, regex, fingerprint };

    routes.push(route);
  },
  find(method, path) {
    method = method.toLowerCase();
    path = path.split('?')[0];

    let route = routes.filter(r => r.method === method && path.match(r.regex));

    if (!route.length)
      return null;

    return route[0];
  }
};
