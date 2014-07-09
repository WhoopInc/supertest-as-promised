var Promise = require("bluebird");

module.exports = require("supertest");

module.exports.Test.prototype.then = function() {
  var promise = new Promise(function(resolve, reject) {
    this.end(function(err, res) {
      return err ? reject(err) : resolve(res);
    });
  }.bind(this));

  return promise.then.apply(promise, arguments);
};
