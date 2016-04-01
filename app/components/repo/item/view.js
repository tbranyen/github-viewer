define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Layout = Backbone.Layout.extend({
    template: require("template!./template"),

    tagName: "li",

    serialize: function() {
      return { model: this.model };
    },

    events: {
      click: "showCommits"
    },
    
    showCommits: function(ev) {
      var model = this.model;
      var org = app.router.users.org;
      var user = app.router.repos.user;

      // Add the active class.
      this.makeActive();

      // Easily create a URL.
      app.router.go("org", org, "user", user, "repo", model.get("name"));

      return false;
    },

    makeActive: function() {
      // Remove the active class from all other repo items.
      this.$el.siblings().removeClass("active");
      // Add the active class here.
      this.$el.addClass("active");
    },

    beforeRender: function() {
      if (this.options.active) {
        this.makeActive();
      }
    }
  });

  module.exports = Layout;
});
