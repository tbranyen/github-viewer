define(function(require) {
  "use strict";

  var Backbone = require("backbone");
  var Router = require("router");

  // Test that the Router exists.
  describe("Router", function() {

    beforeEach(function() {
      this.mainEl = document.createElement('main');
      document.body.appendChild(this.mainEl);
    });

    afterEach(function() {
      document.body.removeChild(this.mainEl);
    });

    it("should exist", function() {
      expect(Router).to.exist;
      expect(new Router()).to.be.an.instanceof(Backbone.Router);
    });

    it("should run index method when history is started", function() {
      Backbone.history.start();
    });
  });
});
