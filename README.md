<a href="http://promisesaplus.com/">
  <img src="https://promises-aplus.github.io/promises-spec/assets/logo-small.png"
    align="right" valign="top" alt="Promises/A+ logo">
</a>

# supertest-as-promised

<a href="https://travis-ci.org/WhoopInc/supertest-as-promised">
  <img src="https://travis-ci.org/WhoopInc/supertest-as-promised.svg?branch=master"
    align="right" valign="top" alt="Build Status">
</a>

SuperTest as Promised supercharges [SuperTest] with a `then` method.

Instead of layering callbacks on callbacks in your tests:

```js
request(app)
  .get("/user")
  .expect(200, function (err, res) {
    if (err) return done(err);

    var userId = res.body.id;
    request(app)
      .post("/kittens")
      .send({ userId: userId, ... })
      .expect(201, function (err, res) {
        if (err) return done(err);

        // ...
      });
  });
```

chain your requests like you were promised:

```js
return request(app)
  .get("/user")
  .expect(200)
  .then(function (res) {
    return request(app)
      .post("/kittens")
      .send({ userId: res})
      .expect(201);
  })
  .then(function (res) {
    // ...
  });
```

## Usage

SuperTest as Promised operates just like normal [SuperTest], except that the
object returned by `.get`, `.post`, etc. is a proper
thenable:

```js
var express = require("express")
  , request = require("supertest-as-promised");

var app = express();

request(app)
  .get("/kittens")
  .expect(200)
  .then(function (res) {
    // ...
  });
```

If you use a promise-friendly test runner, you can just
return your `request` chain from the test case rather than messing with a
callback:

```js
describe("GET /kittens", function () {
  it("should work", function () {
    return request(app).get("/kittens").expect(200);
  });
});
```

### Upstream documentation

SuperTest as Promised is built on top of [SuperTest], which is in turn
built on top of [SuperAgent]. You'll want to be familiar with both of
those packages' APIs.

Here's the quick rundown if you're unfamiliar. SuperAgent is a generic
HTTP client that provides methods for fluently constructing HTTP requests
(e.g., `.get`, `.send`, `.query`, `.auth`). See the
[SuperAgent docs][SuperAgent] for a full list of methods. SuperTest allows
you to tack on assertions about e.g. response status (`.expect(200)`) or
content (`.expect(/^kitties are \w+$/)`) to a SuperAgent request. See the
[`.expect` function API][expect-api] in the SuperTest documentation for details.

### Agents

If you use a SuperTest agent to persist cookies, those are thenable too:

```js
var agent = require("supertest-as-promised").agent(app);

agent
  .get("/ugly-kitteh")
  .expect(404)
  .then(function () {
    // ...
  })
```


### Promisey goodness

To start, only the `then` and `catch` methods are exposed. But once you've
called `.then` or `.catch` once, you've got a proper [Bluebird] promise that
supports the whole gamut of promisey goodness:

```js
request(app)
  .get("/kittens")
  .expect(201)
  .then(function (res) { /* ... */ })
  // I'm a real promise now!
  .catch(function (err) { /* ... */ })
```

See the [Bluebird API][bluebird-api] for everything that's available.

You may find it cleaner to cast directly to a promise using the `toPromise`
method:

```js
request(app)
  .get("/kittens")
  .expect(201)
  .toPromise()
  // I'm a real promise now!
  .delay(10)
  .then(function (res) { /* ... */ })
```

### BYOP: Bring your own `Promise`

You can supply own promise library so that the promises returned have your
convenience methods of choice.

Simply call the SuperTest as Promised module with a ES6-compliant `Promise`
constructor, and you'll get back a new module configured to return your custom
promises. To swap in [when.js], for example:

```js
var when = require("when")
  , request;

request = require("supertest-as-promised")(when.Promise);
request(app)
  .get("/when.js")
  .then(function (res) { /* ... */ })
  // I'm a when.js promise! (instanceof when.Promise == true)
  .frobulate()

request = require("supertest-as-promised");
request(app)
  .get("/bluebird.js")
  .then(function (res) { /* .. */ })
  // I'm back to the default Bluebird promise!
```

### Debugging

Suppose your snazzy test

```js
it("should get kittens", function () {
  return request(app).get("/kittens").expect(200)
    .then(function (res) {
      return expect(res.body).to.equal("kittens r cute!");
    });
});
```

suddenly starts failing with a "400 Bad Request" error. It'd sure be
handy if you could print out the response body to see if the server
mentioned what, in particular, was bad about your test. Chain on a
`.catch` and inspect `err.response`:

```js
it("should get kittens", function () {
  return request(app).get("/kittens").expect(200)
    .then(function (res) {
      return expect(res.text).to.equal("kittens r cute!");
    })
    .catch(function (err) {
      console.log(err.response.text); // "You have viewed too many kittens today."
    });
});
```


## Installation

### Node

```bash
$ npm install supertest supertest-as-promised
```

SuperTest as Promised lists [`supertest`][SuperTest] as a
[peer dependency][peer-dependency], so it'll wrap whatever version of SuperTest
you've asked for in your own `package.json`.

In earlier versions of NPM, failing to list SuperTest as a dependency would get
you the latest version. In NPM 3, failing to list SuperTest as a dependency will
generate a warning and SuperTest will not be installed.

Do note that SuperTest as Promised is a well-behaved citizen and doesn't
monkey-patch SuperTest directly:

```js
// I return thenables!
var request = require("supertest-as-promised");

// I'm lame and force you to use callbacks
var request = require("supertest");
```


## Versions

We follow [semver]: the major version number will be upgraded with any breaking
change. Breaking changes in each major version are listed below. Consult the
[changelog] for a list of meaningful new features in each version; consult the
commit log for a complete list.

### Breaking changes in 4.0

* In `.catch` handlers, `err.response` is now marked as non-enumerable.

### Breaking changes in 3.0

* [Bluebird][bluebird] has been upgraded to version 3.3.1.

### Breaking changes in 2.0

* [Bluebird][bluebird] has been upgraded to version 2.9.24.

[bluebird]: https://github.com/petkaantonov/bluebird
[bluebird-api]: https://github.com/petkaantonov/bluebird/blob/master/API.md#promiseisdynamic-value---boolean
[changelog]: CHANGELOG.md
[expect-api]: https://github.com/visionmedia/supertest#api
[peer-dependency]: http://blog.nodejs.org/2013/02/07/peer-dependencies/
[semver]: http://semver.org
[SuperAgent]: http://visionmedia.github.io/superagent/
[SuperTest]: https://github.com/visionmedia/supertest
[when.js]: https://github.com/cujojs/when
