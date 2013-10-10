define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    // Use the <TR> from the template.
    el: false,

    serialize: function() {
      return {
        model: this.model,
        repo: this.options.repo,
        user: this.options.user
      };
    }
  });

  module.exports = Layout;
});
