'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

// const router = new Phrapi.Router({ routes, basePath: '/v1' });
var router = new _2['default'].Router({ routes: _routes2['default'] });

var api = new _2['default'].Server({ router: router });

api.start(3000, function (err) {
  if (err) throw err;

  console.log('listening!', api);
});