define([
  // Global application context.
  "app",

  // Libs
  "backbone",

  // Modules
  "modules/commit"
],

function(app, Backbone, Commit) {

  var Repo = app.module();

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

  Repo.Views.Item = Backbone.View.extend({
    template: "repos/item",

    tagName: "li",

    serialize: function() {
      return { model: this.model };
    },

    events: {
      click: "showCommits"
    },
    
    showCommits: function(ev) {
      var model = this.model;
      var commits = app.router.commits;

      commits.user = model.collection.user;
      commits.repo = model.get("name");
      commits.fetch();
    }
  });

  Repo.Views.List = Backbone.View.extend({
    template: "repos/list",

    className: "repos-wrapper",

    render: function(manage) {
      this.collection.each(function(repo) {
        this.insertView("ul", new Repo.Views.Item({
          model: repo
        }));
      }, this);

      return manage(this).render({ count: this.collection.length });
    },

    initialize: function() {
      this.collection.on("reset", function() {
        this.render();
      }, this);
    }
  });

  return Repo;

});
