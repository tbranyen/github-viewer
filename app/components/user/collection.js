define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Collection = Backbone.Collection.extend({
    url: function() {
      return app.api + "orgs/" + this.org + "/members?callback=?";
    }
  });

  module.exports = Collection;
});
