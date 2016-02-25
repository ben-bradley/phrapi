'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var buildFingerprint = function buildFingerprint(path) {
  var params = path.match(/\{(.+?)\}/g) || [];

  return '^' + params.reduce(function (path, param) {
    return path.replace(param, '([^\/\?]+?)');
  }, path) + '$';
};

var Router = function Router() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$routes = _ref.routes;
  var routes = _ref$routes === undefined ? [] : _ref$routes;
  var _ref$pathPrefix = _ref.pathPrefix;
  var pathPrefix = _ref$pathPrefix === undefined ? '/' : _ref$pathPrefix;

  var router = {
    routes: [],

    route: function route() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var path = _ref2.path;
      var method = _ref2.method;
      var flow = _ref2.flow;

      if (!path) throw new Error('Routes require a path.');else if (!method) throw new Error('Routes require a method.');else if (!flow) throw new Error('Routes require a flow.');

      path = (pathPrefix + path).replace(/\/+/, '/');

      var params = (path.match(/\{(.+?)\}/g) || []).map(function (p) {
        return p.replace(/[\{\}]/g, '');
      }),
          fingerprint = buildFingerprint(path),
          regex = new RegExp(fingerprint);

      method = method.toLowerCase();

      var exists = router.routes.filter(function (r) {
        return r.method === method && r.fingerprint === fingerprint;
      });

      if (exists.length) {
        var existing = exists[0].method.toUpperCase() + ' ' + exists[0].path,
            duplicate = method.toUpperCase() + ' ' + path;

        throw new Error('Route exists. Duplicate: ' + duplicate + ', Existing: ' + existing);
      }

      var route = { method: method, path: path, flow: flow, params: params, regex: regex, fingerprint: fingerprint };

      router.routes.push(route);
    },

    find: function find(method, path) {
      method = method.toLowerCase();
      path = path.split('?')[0];

      var route = router.routes.filter(function (r) {
        return r.method === method && path.match(r.regex);
      });

      if (!route.length) return null;

      return route[0];
    }
  };

  if (routes.length) routes.map(router.route);

  return router;
};

exports['default'] = Router;
module.exports = exports['default'];