define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Collection = Backbone.Collection.extend({
    url: function() {
      return app.api + "repos/" + this.user + "/" + this.repo +
        "/commits?callback=?";
    }
  });

  module.exports = Collection;
});
