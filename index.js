var _ = require("lodash")
  , Promise = require("bluebird")
  , supertest = require("supertest");

function then(onFulfilled, onRejected) {
  return Promise.promisify(this.end, this)()
    .then(onFulfilled, onRejected);
}

module.exports = function () {
  // Let SuperTest work its magic on whatever arguments we receive
  var request = supertest.apply(null, arguments);

  // Wrap all SuperTest functions (`get`, `post`, etc.) so we can inject a
  // `then` method into the returned `Test` instance
  return _.mapValues(request, function wrap(fn) {
    return function () {
      var test = fn.apply(null, arguments);
      test.then = then;
      return test;
    };
  });
};
