'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

var processPayload = function processPayload(request) {
  return new Promise(function (resolve, reject) {
    var payload = '';

    request.on('data', function (data) {
      return payload += data;
    });
    request.on('end', function () {
      if (!payload.length) return resolve({});

      try {
        resolve(JSON.parse(payload));
      } catch (err) {
        reject(_errors2['default'].badRequest());
      }
    });
  });
};

exports['default'] = processPayload;
module.exports = exports['default'];