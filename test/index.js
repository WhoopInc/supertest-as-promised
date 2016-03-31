var expect = require("chai").expect
  , http = require("http")
  , Promise = require("bluebird")
  , PromiseWhen = require("when").Promise
  , supertest = require("supertest")
  , supertestAsPromised = require("..");

function PromiseMock() {
  var self = this;
  ["then", "catch"].forEach(function (fn) {
    self[fn] = function () {
      this[fn].args.push([].slice.call(arguments));
      return this;
    }
    self[fn].args = [];
  })
}
PromiseMock.resolve = PromiseMock.reject = function () {};

var server = http.createServer(function (req, res) {
  res.end("helo");
});

describe("supertestAsPromised", function () {
  var request = supertestAsPromised(server);

  describe("Test instances", function () {
    describe("#toPromise", function () {
      it("should return a bluebird promise by default", function () {
        expect(request.get("/home").toPromise()).to.be.an.instanceOf(Promise);
      });

      it("should return a when promise if configured with when", function () {
        var request = supertestAsPromised(PromiseWhen)(server);
        expect(request.get("/home").toPromise()).to.be.an.instanceOf(PromiseWhen);
      });

      it("should still return a bluebird promise by default", function () {
        expect(request.get("/home").toPromise()).to.be.an.instanceOf(Promise);
      });
    });

    it("should fulfill if all assertions pass", function () {
      return expect(request.get("/home").expect(200)).to.eventually.be.fulfilled;
    });

    it("should fulfill with the response", function () {
      return request.get("/home").then(function (res) {
        expect(res.text).to.equal("helo");
      });
    });

    it("should reject if an assertion fails", function () {
      return expect(request.get("/home").expect(500)).to.eventually.be.rejected;
    });

    it("should call then with two arguments", function () {
      var mock = supertestAsPromised(PromiseMock)(server).get("/home").then(1, 2, 3);
      expect(mock.then.args).to.deep.equal([[1, 2]]);
    });

    it("should call catch with arbitrary arguments", function () {
      var mock = supertestAsPromised(PromiseMock)(server).get("/home").catch(1, 2, 3);
      expect(mock.catch.args).to.deep.equal([[1, 2, 3]]);
    });
  });

  describe("TestAgent instances", function () {
    var agent = supertestAsPromised.agent(server);

    describe("#toPromise", function () {
      it("should return a promise", function () {
        expect(agent.get("/home").toPromise()).to.be.an.instanceOf(Promise);
      });
    });

    it("should fulfill if all assertions pass", function () {
      return expect(agent.get("/home").expect(200)).to.eventually.be.fulfilled;
    });

    it("should fulfill with the response", function () {
      return agent.get("/home").then(function (res) {
        expect(res.text).to.equal("helo");
      });
    });

    it("should reject if an assertion fails", function () {
      return expect(agent.get("/home").expect(500)).to.eventually.be.rejected;
    });
  });
});

describe("supertest", function () {
  describe("Test instances", function () {
    var request = supertest(server);

    it("should not have toPromise", function () {
      request.get("/home").should.not.have.property("toPromise");
    });
  });

  describe("TestAgent instances", function () {
    var agent = supertest.agent(server);

    it("should not have toPromise", function () {
      agent.get("/home").should.not.have.property("toPromise");
    });
  });
});
