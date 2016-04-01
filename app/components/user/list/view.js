define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var Item = require("../item/view");

  var Layout = Backbone.Layout.extend({
    template: require("template!./template"),

    serialize: function() {
      return { users: this.collection };
    },

    beforeRender: function() {
      this.collection.each(function(user) {
        this.insertView(".user-list", new Item({
          model: user
        }));
      }, this);
    },

    afterRender: function() {
      // Only re-focus if invalid.
      this.$("input.invalid").focus();
    },

    initialize: function() {
      // Whenever the collection resets, re-render.
      this.listenTo(this.collection, "reset sync request", this.render);
    },

    events: {
      "submit form": "updateOrg"
    },

    updateOrg: function(ev) {
      app.router.go("org", this.$(".org").val());

      return false;
    }
  });

  module.exports = Layout;
});
