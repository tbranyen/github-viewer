define([
  // Global application context.
  "app",

  // Third-party libraries.
  "backbone",

  // Modules
  "modules/repo"
],

function(app, Backbone, Repo) {

  var User = app.module();

  User.Collection = Backbone.Collection.extend({
    url: function() {
      return "https://api.github.com/orgs/" + this.org + "/members?callback=?";
    },

    parse: function(obj) {
      // Safety check ensuring only valid data is used
      if (obj.data.message !== "Not Found") {
        this.status = "valid";

        return obj.data;
      }

      this.status = "invalid";

      return this.models;
    },

    initialize: function(models, options) {
      if (options) {
        this.org = options.org;
      }
    }
  });

  User.Views.Item = Backbone.View.extend({
    template: "users/item",

    tagName: "li",

    serialize: function() {
      return { model: this.model };
    },

    events: {
      click: "changeUser"
    },

    changeUser: function(ev) {
      var model = this.model;

      app.router.repos.user = model.get("login");
      app.router.repos.fetch();
    },

    initialize: function() {
      this.model.on("change", function() {
        this.render();
      }, this);
    }
  });

  User.Views.List = Backbone.View.extend({
    template: "users/list",

    serialize: function() {
      return { collection: this.collection };
    },

    render: function(manage) {
      this.collection.each(function(user) {
        this.insertView("ul", new User.Views.Item({
          model: user
        }));
      }, this);

      return manage(this).render().then(function(el) {
        // Only re-focus if invalid
        this.$("input.invalid").focus();
      });
    },

    initialize: function() {
      this.collection.bind("reset", function() {
        this.render();
      }, this);
    },

    events: {
      "keyup .org": "updateOrg"
    },

    updateOrg: $.debounce(450, function(ev) {
      var name = ev.target.value;

      app.router.users.org = name;
      app.router.users.fetch();
    })
  });

  return User;

});
