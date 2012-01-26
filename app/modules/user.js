define([
  "namespace",

  // Libs
  "use!backbone",

  // Modules
  "modules/repo",

  // Plugins
  "use!plugins/backbone.layoutmanager",
  "use!plugins/jquery.ba-throttle-debounce"
],

function(bocoup, Backbone, Repo) {

  // Shorthand the app
  var app = bocoup.app;

  // Create a new module
  var User = bocoup.module();

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

  User.Views.Item = Backbone.LayoutManager.View.extend({
    template: "users/item",

    tagName: "li",

    serialize: function() {
      return this.model.toJSON();
    },

    events: {
      click: "changeUser"
    },

    changeUser: function(ev) {
      var model = this.model;

      app.repos.user = model.get("login");
      app.repos.fetch();
    }
  });

  User.Views.List = Backbone.View.extend({
    template: "users/list",

    render: function(layout) {
      var view = layout(this);

      this.collection.each(function(user) {
        view.insert("ul", new User.Views.Item({
          model: user
        }));
      });

      return view.render(this.collection).then(function(el) {
        // Only re-focus if invalid
        $(el).find("input.invalid").focus();
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

      app.users.org = name;
      app.users.fetch();
    })
  });

  // Required, return the module for AMD compliance
  return User;

});
