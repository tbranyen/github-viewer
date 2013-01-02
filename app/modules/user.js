define(function(require, exports, module) {
  "use strict";

  var Backbone = require("backbone");
  var app = require("app");
  var Repo = require("modules/repo");

  var User = exports;

  User.Collection = Backbone.Collection.extend({
    url: function() {
      return "https://api.github.com/orgs/" + this.org + "/members?callback=?";
    },

    parse: function(obj) {
      // Safety check ensuring only valid data is used.
      if (obj.data.message !== "Not Found") {
        this.status = "valid";

        return obj.data;
      }

      this.status = "invalid";

      return obj;
    },

    initialize: function(models, options) {
      if (options) {
        this.org = options.org;
      }
    }
  });

  User.Views = {
    Item: Backbone.Layout.extend({
      template: require("ldsh!user/item"),

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
    }),

    List: Backbone.Layout.extend({
      template: require("ldsh!user/list"),

      serialize: function() {
        return { users: this.options.users };
      },

      beforeRender: function() {
        this.options.users.each(function(user) {
          this.insertView(".user-list", new User.Views.Item({
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
        this.listenTo(this.options.users, "reset sync request", this.render);
      },

      events: {
        "submit form": "updateOrg"
      },

      updateOrg: function(ev) {
        app.router.go("org", this.$(".org").val());

        return false;
      }
    })
  };
});
