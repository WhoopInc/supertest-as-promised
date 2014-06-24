var methods = require("methods")
  , Promise = require("bluebird")
  , supertest = require("supertest");

// Alias both .del() and .delete() to supertest's .del()
methods.push("del");
var methodAliases = {
  "delete": "del"
};

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
      var methodName = methodAliases[method] || method;
      var test = factory[methodName].apply(factory, arguments);
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
