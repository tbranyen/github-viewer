require([
  // Global
  "app",

  // Libs
  "jquery",
  "backbone",

  // Modules
  "modules/repo",
  "modules/user",
  "modules/commit"
],

function (app, $, Backbone, Repo, User, Commit) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "org/:name": "org",
      "org/:org/user/:name": "user",
      "org/:org/user/:user/repo/:name": "repo"
    },

    index: function() {
      this.users.reset();
      this.repos.reset();
      this.commits.reset();

      this.useLayout("main");
    },

    org: function(name) {
      this.repos.reset();
      this.commits.reset();

      this.useLayout("main");

      // Set the organization.
      this.users.org = name;

      // Fetch the data.
      this.users.fetch();
    },

    user: function(org, name) {
      // Reset the data.
      this.commits.reset();

      this.useLayout("main");

      // Set the organization.
      this.users.org = org;
      // Set the user name.
      this.repos.user = name;

      // Fetch the data
      this.users.fetch();
      this.repos.fetch();
    },

    repo: function(org, user, name) {
      this.useLayout("main");

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

    initialize: function() {
      // Set up the users.
      this.users = new User.Collection();
      // Set the repos.
      this.repos = new Repo.Collection();
      // Set up the commits.
      this.commits = new Commit.Collection();

      // Start with the default layout.
      this.useLayout("main");

      // Set all the views.
      this.layout.setViews({
        ".users": new User.Views.List({
          collection: this.users
        }),

        ".repos": new Repo.Views.List({
          collection: this.repos
        }),

        ".commits": new Commit.Views.List({
          collection: this.commits
        })
      });
    },

    useLayout: function(name) {
      // If already using this Layout, then don't re-inject into the DOM.
      if (this.layout) {
        return this.layout;
      }

      // Create a new Layout.
      this.layout = new Backbone.Layout({
        template: name,
        className: "layout " + name,
        id: "layout"
      });

      // Insert into the DOM.
      $("#main").html(this.layout.el);

      // Render the layout.
      this.layout.render();

      return this.layout;
    }
  });

  // Treat the jQuery ready function as the entry point to the application.
  // Inside this function, kick-off all initialization, everything up to this
  // point should be definitions.
  $(function() {
    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new Router();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start({ pushState: true });
  });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the anchor href and protcol
    var href = $(this).attr("href");
    var protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning it's relative.
    if (href && href.slice(0, protocol.length) !== protocol &&
        href.indexOf("javascript:") !== 0) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.
      Backbone.history.navigate(href, true);
    }
  });

});
