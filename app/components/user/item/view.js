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
      click: "changeUser"
    },

    changeUser: function(ev) {
      var model = this.model;
      var org = app.router.users.org;
      var name = model.get("login");

      app.router.go("org", org, "user", name);
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    }
  });

  module.exports = Layout;
});
