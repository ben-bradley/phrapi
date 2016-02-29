'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var router = new _2['default'].Router({ routes: _routes2['default'] });

var server = new _2['default'].Server({ router: router });

server.test({
  method: 'get',
  path: '/ping'
}).then(function (json) {
  // assert on json
  console.log('you got back:', json);
})['catch'](function (err) {
  console.log('There was an error!');
  console.log(err.message);
  process.exit(1);
});

server.test({
  method: 'post',
  path: '/foo',
  payload: { blargh: 'honk' }
}).then(function (json) {
  // assert on json
  console.log('you got back:', json);
})['catch'](function (err) {
  console.log('There was an error!');
  console.log(err.message);
  process.exit(1);
});