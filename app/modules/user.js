define([
  "namespace",

  // Libs
  "use!backbone",

  // Modules
  "modules/repo",

  // Plugins
  "use!plugins/backbone.layoutmanager"
],

function(bocoup, Backbone, Repo) {

  // Shorthand the app
  var app = bocoup.app;

  // Create a new module
  var User = bocoup.module();

  User.Model = Backbone.Model.extend({

  });

  User.Collection = Backbone.Collection.extend({
    model: User.Model,

    url: function() {
      return "https://api.github.com/orgs/" + this.org + "/members?callback=?";
    },

    parse: function(obj) {
      return obj.data;
    },

    initialize: function(models, options) {
      this.org = options.org;
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
      var repos = new Repo.Collection([], { user: model.get("login") });

      repos.fetch().success(function() {
        app.repos.reset(repos.models);
      });
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

      return view.render();
    },

    initialize: function() {
      this.collection.bind("reset", function() {
        this.render();
      }, this);
    }
  });

  // Required, return the module for AMD compliance
  return User;

});
