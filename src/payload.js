'use strict';

const processPayload = (request) => new Promise((resolve, reject) => {
  let payload = '';

  request.on('data', (data) => payload += data);
  request.on('end', () => {
    if (!payload.length)
      return resolve({});

    try { resolve(JSON.parse(payload)); }
    catch(err) { reject({ code: 400, message: 'invalid payload' }); }
  });
});

export default processPayload;
