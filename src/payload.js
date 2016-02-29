'use strict';

import Errors from './errors';

const processPayload = (request) => new Promise((resolve, reject) => {
  let payload = '';

  request.on('data', (data) => payload += data);
  request.on('end', () => {
    if (!payload.length)
      return resolve({});

    try { resolve(JSON.parse(payload)); }
    catch(err) { reject(Errors.badRequest()); }
  }); });

export default processPayload;
