'use strict';

import should from 'should';

const asserts = {
  route(obj) {
    (obj).should.be.an.Object.with.properties([ 'path', 'method', 'flow', 'params', 'regex', 'fingerprint' ]);
    (obj.path).should.be.a.String;
    (obj.method).should.be.a.String;
    (obj.flow).should.be.an.Array;
    (obj.flow.length > 0).should.be.ok;
    (obj.params).should.be.an.Array;
    (obj.regex).should.be.a.RegExp;
    (obj.fingerprint).should.be.a.String;
  },
  router(obj) {
    (obj).should.be.an.Object.with.properties([ 'routes', 'route', 'find' ]);
    (obj.routes).should.be.an.Array;
    (obj.route).should.be.a.Function;
    (obj.find).should.be.a.Function;
  },
  server(obj) {
    (obj).should.be.an.Object.with.properties([ 'route', 'start', 'router' ]);
    (obj.route).should.be.a.Function;
    (obj.start).should.be.a.Function;
    asserts.router(obj.router);
  },
  startedServer(obj) {
    (obj).should.be.an.Object.with.properties([ 'info' ]);
    (obj.info).should.be.an.Object.with.properties([ 'port' ]);
    (obj.info.port).should.be.a.Number;
    asserts.server(obj);
  }
};

export default asserts;
