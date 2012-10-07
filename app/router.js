define([
  // Application.
  "app",

  // Modules.
  "modules/repo",
  "modules/user",
  "modules/commit"
],

function(app, Repo, User, Commit) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
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

      // Fetch the data
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
      // Set the repo name
      this.commits.user = user;
      this.commits.repo = name;

      // Fetch the data
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
    },

    initialize: function() {
      var collections = {
        // Set up the users.
        users: new User.Collection(),

        // Set the repos.
        repos: new Repo.Collection(),

        // Set up the commits.
        commits: new Commit.Collection()
      };

      // Ensure the router has references to the collections.
      _.extend(this, collections);

      // Use main layout and set Views.
      app.useLayout().setViews({
        ".users": new User.Views.List(collections),
        ".repos": new Repo.Views.List(collections),
        ".commits": new Commit.Views.List(collections)
      }).render();
    }
  });

  return Router;

});
