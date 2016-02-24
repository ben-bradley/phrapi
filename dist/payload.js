'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
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
        reject({ code: 400, message: 'invalid payload' });
      }
    });
  });
};

exports['default'] = processPayload;
module.exports = exports['default'];