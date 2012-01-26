define([
  "namespace",

  // Libs
  "use!backbone",

  // Modules
  "modules/commit",

  // Plugins
  "use!plugins/backbone.layoutmanager"
],

function(bocoup, Backbone, Commit) {

  // Shorthand the app
  var app = bocoup.app;

  // Create a new module
  var Repo = bocoup.module();

  Repo.Collection = Backbone.Collection.extend({
    url: function() {
      return "https://api.github.com/users/" + this.user + "/repos?callback=?";
    },

    parse: function(obj) {
      // Safety check ensuring only valid data is used
      if (obj.data.message !== "Not Found") {
        return obj.data;
      }

      return this.models;
    },

    initialize: function(models, options) {
      if (options) {
        this.user = options.user;
      }
    },

    comparator: function(repo) {
      return repo.get("name").toLowerCase();
    }
  });

  Repo.Views.Item = Backbone.LayoutManager.View.extend({
    template: "repos/item",

    tagName: "li",

    serialize: function() {
      return this.model.toJSON();
    },

    events: {
      click: "showCommits"
    },
    
    showCommits: function(ev) {
      var model = this.model;

      app.commits.user = model.collection.user;
      app.commits.repo = model.get("name");

      app.commits.fetch();
    }
  });

  Repo.Views.List = Backbone.View.extend({
    template: "repos/list",

    className: "repos-wrapper",

    render: function(layout) {
      var view = layout(this);

      this.collection.each(function(repo) {
        view.insert("ul", new Repo.Views.Item({
          model: repo
        }));
      });

      return view.render({ count: this.collection.length });
    },

    initialize: function() {
      this.collection.bind("reset", function() {
        this.render();
      }, this);
    }
  });

  // Required, return the module for AMD compliance
  return Repo;

});
