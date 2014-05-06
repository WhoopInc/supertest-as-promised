var http = require("http")
  , Promise = require("bluebird")
  , supertest = require("supertest")
  , supertestAsPromised = require("..");

var server = http.createServer(function (req, res) {
  res.end("helo");
});

describe("supertestAsPromised", function () {
  var request = supertestAsPromised(server);

  describe("Test", function () {
    describe("#then", function () {
      it("should return a promise", function () {
        request.get("/home").then().should.be.an.instanceOf(Promise);
      });

      it("should fulfill if all assertions pass", function () {
        return request.get("/home").expect(200).should.eventually.be.fulfilled;
      });

      it("should fulfill with the response", function () {
        return request.get("/home").then(function (res) {
          res.text.should.equal("helo");
        });
      });

      it("should reject if an assertion fails", function () {
        return request.get("/home").expect(500).should.eventually.be.rejected;
      });
    });
  });
});

describe("supertest", function () {
  var request = supertest(server);

  describe("Test", function () {
    it("should not be a promise", function () {
      request.get("/home").should.not.have.property("then");
    });
  });
});
