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
      return -new Date(repo.get("pushed_at"));
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
      var org = app.router.users.org;
      var user = app.router.repos.user;

      this.$el.parent().children().removeClass("active");
      this.$el.addClass("active");

      // Easily create a URL
      app.router.go("org", org, "user", user, "repo", model.get("name"));

      return false;
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
