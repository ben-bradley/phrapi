'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var routes = [];

var buildFingerprint = function buildFingerprint(path, params) {
  return '^' + params.reduce(function (path, param) {
    return path.replace(param, '([^\/\?]+?)');
  }, path) + '$';
};

exports['default'] = {
  route: function route(options) {
    var path = options.path;
    var method = options.method;
    var flow = options.flow;
    var _params = path.match(/\{(.+?)\}/g) || [];
    var params = _params.map(function (p) {
      return p.replace(/[\{\}]/g, '');
    });
    var fingerprint = buildFingerprint(path, _params);
    var regex = new RegExp(fingerprint);

    method = method.toLowerCase();

    var exists = routes.filter(function (r) {
      return r.method === method && r.fingerprint === fingerprint;
    });

    if (exists.length) {
      var existing = exists[0].method.toUpperCase() + ' ' + exists[0].path,
          duplicate = method.toUpperCase() + ' ' + path;

      throw new Error('Route exists. Duplicate: ' + duplicate + ', Existing: ' + existing);
    }

    var route = { method: method, path: path, flow: flow, params: params, regex: regex, fingerprint: fingerprint };

    routes.push(route);
  },
  find: function find(method, path) {
    method = method.toLowerCase();
    path = path.split('?')[0];

    var route = routes.filter(function (r) {
      return r.method === method && path.match(r.regex);
    });

    if (!route.length) return null;

    return route[0];
  }
};
module.exports = exports['default'];