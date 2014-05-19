var methods = require("methods")
  , Promise = require("bluebird")
  , supertest = require("supertest");

function then(onFulfilled, onRejected) {
  return Promise.promisify(this.end, this)()
    .then(onFulfilled, onRejected);
}

// Creates a new object that inherits from `factory`, where each HTTP method
// (`get`, `post`, etc.) is overriden to inject a `then` method into the
// returned `Test` instance.
function extend(factory) {
  var out = Object.create(factory);

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
  return extend(request);
};

module.exports.agent = function () {
  var agent = supertest.agent.apply(null, arguments);
  return extend(agent);
};
