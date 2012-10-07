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

    data: function() {
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
      app.active = this.model;
      this.render();

      // Easily create a URL.
      app.router.go("org", org, "user", user, "repo", model.get("name"));

      return false;
    },

    beforeRender: function() {
      if (app.active === this.model) {
        this.$el.siblings().removeClass("active");
        this.$el.addClass("active");
      }
    }
  });

  Repo.Views.List = Backbone.View.extend({
    template: "repo/list",

    className: "repos-wrapper",

    data: function() {
      return {
        count: this.options.repos.length 
      };
    },

    beforeRender: function() {
      var active = this.options.commits.repo;

      this.options.repos.each(function(repo) {
        if (repo.get("name") === active) {
          app.active = repo;
        }

        this.insertView("ul", new Repo.Views.Item({
          model: repo
        }));
      }, this);
    },

    cleanup: function() {
      this.options.repos.off(null, null, this);
    },

    initialize: function() {
      this.options.repos.on("reset", this.render, this);

      this.options.repos.on("fetch", function() {
        this.$("ul").parent().html("<img src='/assets/img/spinner.gif'>");
      }, this);
    }
  });

  return Repo;

});
