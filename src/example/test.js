'use strict';

import Phrapi from '../';
import routes from './routes';

const router = new Phrapi.Router({ routes });

const server = new Phrapi.Server({ router });

server.test({
  method: 'get',
  path: '/ping'
}).then(json => {
  // assert on json
  console.log('you got back:', json);
}).catch(err => {
  console.log('There was an error!');
  console.log(err.message);
  process.exit(1);
});

server.test({
  method: 'post',
  path: '/foo',
  payload: { blargh: 'honk' }
}).then(json => {
  // assert on json
  console.log('you got back:', json);
}).catch(err => {
  console.log('There was an error!');
  console.log(err.message);
  process.exit(1);
});
