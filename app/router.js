define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Commit = require("components/commit/index");
  var User = require("components/user/index");
  var Repo = require("components/repo/index");

  require("collectionCache");
  require("bootstrap");

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    initialize: function() {
      // Set up the users.
      this.users = new User.Collection();
      // Set the repos.
      this.repos = new Repo.Collection();
      // Set up the commits.
      this.commits = new Commit.Collection();

      // Use main layout and set Views.
      var Layout = Backbone.Layout.extend({
        el: "main",

        template: require("ldsh!./templates/main"),

        views: {
          ".users": new User.Views.List({ collection: this.users }),
          ".repos": new Repo.Views.List({ collection: this.repos }),
          ".commits": new Commit.Views.List({ collection: this.commits })
        }
      });
      
      // Render to the page.
      new Layout().render();
    },

    routes: {
      "": "index",
      "org/:name": "org",
      "org/:org/user/:name": "user",
      "org/:org/user/:user/repo/:name": "repo"
    },

    index: function() {
      // Reset the state and render.
      this.reset();
    },

    org: function(name) {
      // Reset the state and render.
      this.reset();

      // Set the organization.
      this.users.org = name;

      // Fetch the data.
      this.users.fetch();
    },

    user: function(org, name) {
      // Reset the state and render.
      this.reset();

      // Set the organization.
      this.users.org = org;
      // Set the user name.
      this.repos.user = name;

      // Fetch the data.
      this.users.fetch();
      this.repos.fetch();
    },

    repo: function(org, user, name) {
      // Reset the state and render.
      this.reset();

      // Set the organization.
      this.users.org = org;
      // Set the user name.
      this.repos.user = user;
      // Set the repo name.
      this.commits.user = user;
      this.commits.repo = name;

      // Fetch the data.
      this.users.fetch();
      this.repos.fetch();
      this.commits.fetch();
    },

    // Shortcut for building a url.
    go: function() {
      return this.navigate(_.toArray(arguments).join("/"), true);
    },

    reset: function() {
      // Reset collections to initial state.
      if (this.users.length) {
        this.users.reset();
      }

      if (this.repos.length) {
        this.repos.reset();
      }

      if (this.commits.length) {
        this.commits.reset();
      }

      // Reset active model.
      app.active = false;
      this.commits.repo = false;
    }
  });

  module.exports = Router;
});
