'use strict';

import should from 'should';
import request from 'supertest';

import Phrapi from '../';
import routes from './routes';
import asserts from './asserts';

describe('Phrapi', () => {

  describe('Server()', () => {

    it('should return a server', () => {
      let api = new Phrapi.Server();

      asserts.server(api);
    });

    it('should accept a { Router }', () => {
      let router = new Phrapi.Router({ routes: [ routes[0] ] }),
        api = new Phrapi.Server({ router });

      asserts.server(api);
      asserts.route(api.router.routes[0]);
    });

    describe('server.start()', () => {
      it('should listen on a TCP port', (done) => {
        let api = new Phrapi.Server();

        api.start(0, () => {
          asserts.startedServer(api);
          done();
        });
      });
    });

    describe('server.stop()', () => {
      it('should stop the server', (done) => {
        let api = new Phrapi.Server();

        api.start(0, () => {
          asserts.startedServer(api);
          api.stop();
          done();
        });
      });
    });

    describe('server.route()', () => {
      it('should create a route', () => {
        let api = new Phrapi.Server();

        api.route(routes[0]);

        asserts.route(api.router.routes[0]);
      });

      it('should throw when routes are duped', () => {
        (() => {
          let api = new Phrapi.Server();

          api.route(routes[0]);

          api.route(routes[0]);
          api.route(routes[0]);
        }).should.throw;
      });
    });

    describe('server.test()', () => {

      it('should exercise routes via http.request', (done) => {
        let router = new Phrapi.Router({ routes });
        let api = new Phrapi.Server({ router });

        api.test({ method: 'get', path: '/foo' })
          .then(json => {
            (json).should.be.an.Object.with.property('foo');
            (json.foo).should.eql('bar');
            done();
          })
          .catch(done);

      });

    });

  });

  describe('Router()', () => {
    it('should return a router', () => {
      let router = new Phrapi.Router();

      asserts.router(router);
    });

    describe('router.route()', () => {
      it('should add a route', () => {
        let router = new Phrapi.Router();

        router.route(routes[0]);

        asserts.route(router.routes[0]);
      });

      it('should throw when routes are duped', () => {
        (() => {
          let router = new Phrapi.Router();

          router.route(routes[0]);
          router.route(routes[0]);
        }).should.throw;
      });
    });

    describe('router.find()', () => {
      it('should return a route', () => {
        let router = new Phrapi.Router(),
          route = routes[0],
          { method, path } = route;

        router.route(route);

        asserts.route(router.find(method, path));
      })
    });

  });

  describe('Flows', () => {
    let api = {},
      router = {},
      port = 0,
      req = {};

    beforeEach((done) => {
      router = new Phrapi.Router({ routes });
      api = new Phrapi.Server({ router });

      api.start(0, () => {
        req = request('http://localhost:' + api.info.port);
        done();
      });
    });

    afterEach(() => {
      api = null;
      req = null;
    });

    it('GET /foo', (done) => {
      req.get('/foo')
        .expect(200, { foo: 'bar' })
        .end((err) => done(err));
    });

    it('GET /bar', (done) => {
      req.get('/bar')
        .expect(200, { foo: 'bar', bar: 'baz' })
        .end((err) => done(err));
    });

    it('GET /fail', (done) => {
      req.get('/fail')
        .expect(404)
        .end((err) => done(err));
    });

    it('POST /decorate/bar?bar=baz', (done) => {
      req.post('/decorate/bar?bar=baz')
        .send({ baz: 'qux' })
        .expect(200, {
          params: { foo: 'bar' },
          query: { bar: 'baz' },
          payload: { baz: 'qux' },
          resolved: { foo: 'bar', bar: 'baz' }
        })
        .end((err) => done(err));
    });

    it('GET /parallel', (done) => {
      req.get('/parallel')
        .expect(200, {
          parallel: true,
          resolved: { foo: 'bar', bar: 'baz' }
        })
        .end((err) => done(err));
    });

    it('GET /badRequest', (done) => {
      req.get('/badRequest')
        .expect(400, { code: 400, error: 'Bad Request' })
        .end((err, res) => {
          done(err);
        });
    });

    it('GET /error', (done) => {
      req.get('/error')
        .expect(500, { code: 500, error: 'foobar' })
        .end((err, res) => {
          done(err);
        });
    });

    it('GET /rejector', (done) => {
      req.get('/rejector')
        .expect(500, { code: 500, error: 'foobar' })
        .end((err, res) => {
          done(err);
        });
    });

    it('GET /rejectNoArgs', (done) => {
      req.get('/rejectNoArgs')
        .expect(500, { code: 500, error: 'Unknown error, something was rejected' })
        .end((err, res) => {
          done(err);
        });
    });

    it('GET /customHeaders', (done) => {
      req.get('/customHeaders')
        .expect(200, { foo: 'bar' })
        .expect('x-custom', 'blargh')
        .end((err, res) => {
          done(err);
        });
    });

  });

});
