'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _asserts = require('./asserts');

var _asserts2 = _interopRequireDefault(_asserts);

describe('Phrapi', function () {

  describe('Server()', function () {

    it('should return a server', function () {
      var api = new _2['default'].Server();

      _asserts2['default'].server(api);
    });

    it('should accept a { Router }', function () {
      var router = new _2['default'].Router({ routes: [_routes2['default'][0]] }),
          api = new _2['default'].Server({ router: router });

      _asserts2['default'].server(api);
      _asserts2['default'].route(api.router.routes[0]);
    });

    describe('server.start()', function () {
      it('should listen on a TCP port', function (done) {
        var api = new _2['default'].Server();

        api.start(0, function () {
          _asserts2['default'].startedServer(api);
          done();
        });
      });
    });

    describe('server.stop()', function () {
      it('should stop the server', function (done) {
        var api = new _2['default'].Server();

        api.start(0, function () {
          _asserts2['default'].startedServer(api);
          api.stop();
          done();
        });
      });
    });

    describe('server.route()', function () {
      it('should create a route', function () {
        var api = new _2['default'].Server();

        api.route(_routes2['default'][0]);

        _asserts2['default'].route(api.router.routes[0]);
      });

      it('should throw when routes are duped', function () {
        (function () {
          var api = new _2['default'].Server();

          api.route(_routes2['default'][0]);

          api.route(_routes2['default'][0]);
          api.route(_routes2['default'][0]);
        }).should['throw'];
      });
    });

    describe('server.test()', function () {

      it('should exercise routes via http.request', function (done) {
        var router = new _2['default'].Router({ routes: _routes2['default'] });
        var api = new _2['default'].Server({ router: router });

        api.test({ method: 'get', path: '/foo' }).then(function (json) {
          json.should.be.an.Object['with'].property('foo');
          json.foo.should.eql('bar');
          done();
        })['catch'](done);
      });
    });
  });

  describe('Router()', function () {
    it('should return a router', function () {
      var router = new _2['default'].Router();

      _asserts2['default'].router(router);
    });

    describe('router.route()', function () {
      it('should add a route', function () {
        var router = new _2['default'].Router();

        router.route(_routes2['default'][0]);

        _asserts2['default'].route(router.routes[0]);
      });

      it('should throw when routes are duped', function () {
        (function () {
          var router = new _2['default'].Router();

          router.route(_routes2['default'][0]);
          router.route(_routes2['default'][0]);
        }).should['throw'];
      });
    });

    describe('router.find()', function () {
      it('should return a route', function () {
        var router = new _2['default'].Router();
        var route = _routes2['default'][0];
        var method = route.method;
        var path = route.path;

        router.route(route);

        _asserts2['default'].route(router.find(method, path));
      });
    });
  });

  describe('Flows', function () {
    var api = {},
        router = {},
        port = 0,
        req = {};

    beforeEach(function (done) {
      router = new _2['default'].Router({ routes: _routes2['default'] });
      api = new _2['default'].Server({ router: router });

      api.start(0, function () {
        req = (0, _supertest2['default'])('http://localhost:' + api.info.port);
        done();
      });
    });

    afterEach(function () {
      api = null;
      req = null;
    });

    it('GET /foo', function (done) {
      req.get('/foo').expect(200, { foo: 'bar' }).end(function (err) {
        return done(err);
      });
    });

    it('GET /bar', function (done) {
      req.get('/bar').expect(200, { foo: 'bar', bar: 'baz' }).end(function (err) {
        return done(err);
      });
    });

    it('GET /fail', function (done) {
      req.get('/fail').expect(404).end(function (err) {
        return done(err);
      });
    });

    it('POST /decorate/bar?bar=baz', function (done) {
      req.post('/decorate/bar?bar=baz').send({ baz: 'qux' }).expect(200, {
        params: { foo: 'bar' },
        query: { bar: 'baz' },
        payload: { baz: 'qux' },
        resolved: { foo: 'bar', bar: 'baz' }
      }).end(function (err) {
        return done(err);
      });
    });

    it('GET /parallel', function (done) {
      req.get('/parallel').expect(200, {
        parallel: true,
        resolved: { foo: 'bar', bar: 'baz' }
      }).end(function (err) {
        return done(err);
      });
    });

    it('GET /badRequest', function (done) {
      req.get('/badRequest').expect(400, { code: 400, error: 'Bad Request' }).end(function (err, res) {
        done(err);
      });
    });

    it('GET /error', function (done) {
      req.get('/error').expect(500, { code: 500, error: 'foobar' }).end(function (err, res) {
        done(err);
      });
    });

    it('GET /rejector', function (done) {
      req.get('/rejector').expect(500, { code: 500, error: 'foobar' }).end(function (err, res) {
        done(err);
      });
    });

    it('GET /rejectNoArgs', function (done) {
      req.get('/rejectNoArgs').expect(500, { code: 500, error: 'Unknown error, something was rejected' }).end(function (err, res) {
        done(err);
      });
    });

    it('GET /customHeaders', function (done) {
      req.get('/customHeaders').expect(200, { foo: 'bar' }).expect('x-custom', 'blargh').end(function (err, res) {
        done(err);
      });
    });

    it('GET /resolveNoObject', function (done) {
      req.get('/resolveNoObject').expect(200, {}).end(function (err, res) {
        done(err);
      });
    });
  });
});