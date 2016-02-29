'use strict';

import { request } from 'http';

const startServer = (server) => {
  return new Promise((resolve, reject) => {
    server.start(0, () => resolve(server.info.port));
  });
};

const sendRequest = ({ port, method, path, payload }) => {
  return new Promise((resolve, reject) => {
    let options = { hostname: 'localhost', port, path, method };

    if (payload) {
      payload = JSON.stringify(payload);
      options.headers = {
        'content-type': 'application/json',
        'content-length': payload.length
      };
    }

    request(options, res => {
      let json = '';
      res.setEncoding('utf8');
      res.on('data', data => json += data);
      res.on('end', () => {
        try { resolve(JSON.parse(json)); }
        catch(err) { reject(err); }
      });
    }).end(payload);
  });
};

const test = ({ server, method, path, payload }) => {
  return new Promise((resolve, reject) => {
    Promise.resolve(server)
      .then(server => startServer(server))
      .then(port => sendRequest({ port, method, path, payload }))
      .then(resolve)
      .then(() => server.stop())
      .catch(reject);
  });
};

export default test;
