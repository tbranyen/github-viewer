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

    cache: true,

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
      return -new Date(repo.get("pushed_at"));
    }
  });

  Repo.Views.Item = Backbone.View.extend({
    template: "repo/item",

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

      // Immediately reflect the active state.
      this.model.active = true;
      this.render();

      // Easily create a URL.
      app.router.go("org", org, "user", user, "repo", model.get("name"));

      return false;
    },

    render: function(manage) {
      if (this.model.active) {
        this.$el.siblings().removeClass("active");
        this.$el.addClass("active");
      }

      return manage(this).render();
    }
  });

  Repo.Views.List = Backbone.View.extend({
    template: "repo/list",

    className: "repos-wrapper",

    render: function(manage) {
      var active = app.router.commits.repo;

      this.collection.each(function(repo) {
        if (repo.get("name") === active) {
          repo.active = true;
        }

        this.insertView("ul", new Repo.Views.Item({
          model: repo
        }));
      }, this);

      return manage(this).render({ count: this.collection.length });
    },

    cleanup: function() {
      this.collection.off(null, null, this);
    },

    initialize: function() {
      this.collection.on("reset", function() {
        this.render();
      }, this);
    }
  });

  return Repo;

});
