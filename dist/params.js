'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var params = function params(url, route) {
  var matches = url.split('?')[0].match(route.regex);

  return route.params.reduce(function (params, name, i) {
    params[name] = matches[i + 1];
    return params;
  }, {});
};

exports['default'] = params;
module.exports = exports['default'];