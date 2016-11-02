var methods = require("methods")
  , supertest = require("supertest")
  , util = require("util");

// Support SuperTest's historical `del` alias for `delete`
methods = methods.concat("del");

// Generate a SuperTest as Promised module that returns promise
// instances using the provided `Promise` constructor.
function makeModule(Promise) {
  var out;

  function toPromise() {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.end(function (err, res) {
        if (err) {
          // Attach response to error object so that details about the failure
          // (e.g., the response body) can be accessed by a `.catch` handler
          // (#30).  Use `Object.defineProperty` so that `.response` is
          // non-enumerable; otherwise, the error message is lost in the sea of
          // the response object (#34).
          Object.defineProperty(err, 'response', { value: res });
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  function then(onFulfilled, onRejected) {
    return this.toPromise().then(onFulfilled, onRejected);
  }

  function _catch(onRejected) {
    var promise = this.toPromise();
    return promise.catch.apply(promise, arguments);
  }

  // Creates a new object that wraps `factory`, where each HTTP method
  // (`get`, `post`, etc.) is overriden to inject a `then` method into
  // the returned `Test` instance.
  function wrap(factory, out) {
    methods.forEach(function (method) {
      out[method] = function () {
        var test = factory[method].apply(this, arguments);
        test.toPromise = toPromise;
        test.then = then;
        test.catch = _catch;
        return test;
      };
    });

    return out;
  }

  out = function () {
    var request = supertest.apply(null, arguments);
    return wrap(request, {});
  }

  out.agent = function () {
    var self = this;
    if (!(this instanceof out.agent)) {
      self = Object.create(out.agent.prototype);
    }
    supertest.agent.apply(self, arguments);
    return self;
  }
  util.inherits(out.agent, supertest.agent);
  wrap(supertest.agent.prototype, out.agent.prototype);

  return out;
}

// For backwards compatibility, we allow SuperTest as Promised to be
// used without an explicit `Promise` constructor. Pass these requests
// through to a default module that uses Bluebird promises.

var defaultModule = makeModule(Promise);

module.exports = function (maybePromise) {
  if (typeof maybePromise.resolve === 'function' &&
      typeof maybePromise.reject === 'function') {
    return makeModule(maybePromise);
  }

  return defaultModule.apply(null, arguments);
}

module.exports.agent = defaultModule.agent;
