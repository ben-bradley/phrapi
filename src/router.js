'use strict';

const buildFingerprint = (path) =>  {
  let params = path.match(/\{(.+?)\}/g) || [];

  return '^' + params.reduce((path, param) => {
    return path.replace(param, '([^\/\?]+?)');
  }, path) + '$';
};

const Router = ({ routes = [], pathPrefix = '/' } = {}) => {
  let router = {
    routes: [],

    route({ path , method, flow } = {}) {
      if (!path)
        throw new Error('Routes require a path.');
      else if (!method)
        throw new Error('Routes require a method.');
      else if (!flow)
        throw new Error('Routes require a flow.');

      path = (pathPrefix + path).replace(/\/+/, '/');

      let params = (path.match(/\{(.+?)\}/g) || []).map(p => p.replace(/[\{\}]/g, '')),
        fingerprint = buildFingerprint(path),
        regex = new RegExp(fingerprint);

      method = method.toLowerCase();

      let exists = router.routes.filter(r => r.method === method && r.fingerprint === fingerprint);

      if (exists.length) {
        let existing = exists[0].method.toUpperCase() + ' ' + exists[0].path,
          duplicate = method.toUpperCase() + ' ' + path;

        throw new Error('Route exists. Duplicate: ' + duplicate + ', Existing: ' + existing);
      }

      let route = { method, path, flow, params, regex, fingerprint };

      router.routes.push(route);
    },

    find(method, path) {
      method = method.toLowerCase();
      path = path.split('?')[0];

      let route = router.routes.filter(r => r.method === method && path.match(r.regex));

      if (!route.length)
        return null;

      return route[0];
    }
  };

  if (routes.length)
    routes.map(router.route);

  return router;
};

export default Router;
