# Phrapi [![Build Status](https://secure.travis-ci.org/ben-bradley/phrapi.png?branch=master)](https://travis-ci.org/ben-bradley/phrapi)

> A Promise-handling REST API

## Intent

Phrapi is intended to be simple, composable, and deal exclusively with JSON-based REST.

The goal is not to build a Hapi-level framework with authentication and templating baked in.  If you need those capabilities, use Hapi.  If, instead, you just need something light, fast, and simple, maybe give Phrapi a try.

## About

I've spent a lot of time working with frameworks like Hapi and Express and I really like both.  I tend to prefer Hapi, but there are occasions where Express is the right answer.

I found that the way that I was building APIs began to follow a basic pattern that required me to reproduce the same code structures with predictable regularity.  That pattern is:

- __Routes__ define paths and invoke handlers
- __Handlers__ contain the business logic of the API and invoke controllers to access data
- __Controllers__ CRUD data

Within this pattern, I always made my controllers return promises so that they could be composed into the flows determined by the routes and executed by the handlers and I really liked it.  It was easy to make big changes and still have a codebase that was easy to read for someone that is unfamiliar with the code.

What I felt like I was missing was the ability to have the handlers also deal in Promises.  The structure of the handler function is typically determined by the `route()` method of whatever framework you're using and generally follows the `(request, response[, next]) => {}` signature.  To compose a handler, you typically have to find a way to orchestrate the assignment of data to the request or response context.  Once you've done that, to make it work with Promises, you've got to start all function calls by returning a `new Promise()`.

## Example

```javascript
// handlers.js
'use strict';

const handlers = {
  ping(ctx, resolve, reject) {
    resolve({ pong: new Date() });
  },
  foo(ctx, resolve, reject) {
    let { params } = ctx;

    resolve({ foo: 'URL {bar} param = ' + params.bar });
  },
  bar(ctx, resolve, reject) {
    let { resolved } = ctx;

    resolve({ bar: 'foo resolved = ' + resolved.foo });
  }
};

export default handlers;
```

```javascript
// routes.js
'use strict';

import { ping, foo, bar } from './handlers';

const routes = [{
  method: 'get',
  path: '/ping',
  flow: [ ping ]
}, {
  method: 'get',
  path: '/foo/{bar}',
  flow: [ foo, bar ]
}];

export default routes;
```

```javascript
// server.js
'use strict';

import Phrapi from 'phrapi';
import routes from './routes';

const router = new Phrapi.Router({ routes });

const api = new Phrapi.Server({ router });

api.start(3000, (err) => {
  if (err)
    throw err;

  console.log('listening:', api.info);
});
```

```bash
$ curl localhost:3000/ping
{"pong":"2016-02-25T17:12:46.504Z"}

$ curl localhost:3000/foo/baz
{"bar":"foo resolved = URL {bar} param = baz"}
```

## Phrapi.Server

The `Phrapi.Server()` call will return an object with five properties:

1. `start(port, callback)`
2. `stop()`
3. `route({ route })`
4. `test({ method, path[, payload] })`
5. `info`

`Server()` accepts an optional `{ router: new Phrapi.Router() }` argument making it possible to compose your routing externally to the server code.

`Server.route()` is a convenience call to `Router.route()`.

### `Server.test({ method, path[, payload] })`

In an effort to make testing as easy as possible, the `test()` method was added to the `Server`.  This will programmatically call `server.start(0, () => {})` and send an actual `http.request()` call to trigger the route.

```javascript
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
```

## Phrapi.Router

The `Phrapi.Router()` call returns a ... wait for it ... router object with three properties:

1. `routes[]`
2. `route({Route})`
3. `find(method, path)`

`Router()` accepts an optional `{ routes: [{Route}], pathPrefix: '/v1' }` argument so that you can also compose routes externally and mount them on a specific prefix

```javascript
const router = new Phrapi.Router({ pathPrefix: '/v1' });

router.route({
  method: 'get',
  path: '/foo',
  flow: [(ctx, resolve, reject) => resolve({ foo: true }) ]
});

const server = new Phrapi.Server({ router });

server.start(3000, (err) => {
  if (err)
    throw err;

  console.log('server started:', server.info);
});
```

```bash
$ curl localhost:3000/v1/foo
{"foo":true}
```

### Flows

The `flow` property on a Route is where you compose your handlers to build a response.  The array is processed serially unless you group handler functions within an array.

```javascript
const routes = [{
  method: 'get',
  path: '/foo',
  // when foo resolves, bar is called
  flow: [ foo, bar ]
}, {
  method: 'get',
  path: '/baz',
  // when foo resolves, bar and baz are called with Promise.all
  flow: [ foo, [ bar, baz ] ]
}];
```

### Flow Handlers

A flow handler expects the signature `(ctx, resolve, reject) => {}`.

`resolve()` and `reject()` are the standard ES6 Promise calls.

The `ctx` argument is the context of the request/response that has been decorated with a few properties to make processing simple:

- `params` - An object with key/value pairs parsed from the URL params defined in the route
- `query` - An object with key/value pairs parsed from the query string
- `payload` - The contents of any JSON sent with the request
- `resolved` - When a flow has multiple handlers, the results of any previously resolved handlers are made available in the `ctx.resolved` object.  This makes it possible to quickly compose responses that require multiple database calls to construct the response JSON.  Think of this as being very similar to the `pre` option in Hapi route congifuration, except that it's built in by default.
- `reply` - __CAUTION__ The `reply` property gives you access to tinker with the response HTTP status code, headers, and payload.  You __should not__ mutate payload through this interface!  To mutate the response payload, use the `resolve({})` interface.  If you need to change the `code` or add `headers`, however, this is the place to do that.

> __Whatever the final handler resolves is what becomes the response JSON.__

- `request` - The raw HTTP request
- `response` - The raw HTTP response.  While you _'can'_ make `response.end()` calls here, you _'should'_ rely on the `resolve()` and `reject()` process to ensure that your composed routes function as expected.

## Phrapi.Errors

The `Phrapi.Errors` object has methods for easily composing standard HTTP errors.  It's very much inspired by `Boom`.

```javascript
const router = new Phrapi.Router({ pathPrefix: '/v1' });

router.route({
  method: 'get',
  path: '/error',
  flow: [(ctx, resolve, reject) => reject(Phrapi.Errors.invalidRequest('go away!')) ]
});

const server = new Phrapi.Server({ router });

server.start(3000, (err) => {
  if (err)
    throw err;

  console.log('server started:', server.info);
});
```

```bash
$ curl localhost:3000/v1/error
{"code":400,"message":"go away!"}
```

## Versions

- 1.0.0 - __Breaking change__ - Converted handler signature to `(ctx, resolve, reject)` where `ctx = { request, response, reply, params, query, payload, resolved }`
- 0.1.1 - Readme fix
- 0.1.0 - Added `Server.stop()` and `Server.test()`
- 0.0.2 - Added `reply` to `request` in Handler signature
- 0.0.1 - Initial release

## TODO

- Allow for custom 404
