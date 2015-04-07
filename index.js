var methods = require("methods")
  , Promise = require("bluebird")
  , supertest = require("supertest");

// Support SuperTest's historical `del` alias for `delete`
methods = methods.concat("del");

function then(onFulfilled, onRejected) {
  var end = Promise.promisify(this.end, this);
  return end().then(onFulfilled, onRejected);
}

// Creates a new object that wraps `factory`, where each HTTP method (`get`,
// `post`, etc.) is overriden to inject a `then` method into the returned `Test`
// instance.
function wrap(factory) {
  var out = {};

  methods.forEach(function (method) {
    out[method] = function () {
      var test = factory[method].apply(factory, arguments);
      test.then = then;
      return test;
    };
  });

  return out;
}

module.exports = function () {
  var request = supertest.apply(null, arguments);
  return wrap(request);
};

module.exports.agent = function () {
  var agent = supertest.agent.apply(null, arguments);
  return wrap(agent);
};
