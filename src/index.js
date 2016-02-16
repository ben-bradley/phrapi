'use strict';

import http from 'http';
import handler from './handler';
import router from './router';

const server = http.createServer(handler);

export default {
  start(port, callback) {
    server.listen(port, callback);
  },
  route(options) {
    let { method, path, handler } = options;

    router.route(options);
  }
};
