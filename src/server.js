'use strict';

import http from 'http';
import Handler from './handler';
import Router from './router';

const Server = ({ router = new Router() } = {}) => {
  let handler = new Handler({ router }),
    _server = http.createServer(handler);

  let server = {
    start(port, callback) {
      port = port || 0;

      _server.listen(port, () => {
        server.info = {
          port: _server.address().port
        };

        if (callback)
          return callback();
      });
    },
    route(route) {
      router.route(route);
    },
    router
  };

  return server;
};

export default Server;
