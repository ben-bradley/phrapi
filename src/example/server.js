'use strict';

import Phrapi from '../';
import routes from './routes';

// const router = new Phrapi.Router({ routes, basePath: '/v1' });
const router = new Phrapi.Router({ routes });

const api = new Phrapi.Server({ router });

api.start(3000, (err) => {
  if (err)
    throw err;

  console.log('listening!', api);
});
