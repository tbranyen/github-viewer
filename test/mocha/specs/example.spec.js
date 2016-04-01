define(function(require) {
  "use strict";

  describe("Simple tests examples", function() {
    it("should detect true", function() {
      assert.toEqual(true, true);
    });

    it("should increments values", function() {
      var mike = 0;

      assert.toEqual(mike++, 0);
      assert.toEqual(mike, 1);
    });

    it("should increments values (improved)", function() {
      var mike = 0;

      assert.toEqual(mike++, 0);
      assert.toEqual(mike, 1);
    });
  });

  describe("Tests with before/after hooks", function() {
    var a = 0;

    beforeEach(function() {
      a++;
    });

    afterEach(function() {
      a = 0
    });

    it("should increment value", function() {
      expect(a).to.equal(1);
    });

    it("should reset after each test", function() {
      expect(a).to.equal(1);
    });
  });

  describe("Async tests", function() {
    it("should wait timer", function(done) {
      setTimeout(function() {
        expect(true).to.be.true;
        done();
      }, 500);
    });
  });
});
