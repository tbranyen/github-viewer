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
      "": "index"
    },

    index: function() {
      this.useLayout("main");

      // Set all the views.
      this.layout.setViews({
        ".repos": new Repo.Views.List({
          collection: this.repos
        }),

        ".users": new User.Views.List({
          collection: this.users
        }),

        ".commits": new Commit.Views.List({
          collection: this.commits
        })
      });

      // Render to the page.
      this.layout.render();
    },

    initialize: function() {
      // Set up the users.
      this.users = new User.Collection([], { org: "bocoup" });
      this.users.fetch();

      // Set the repos.
      this.repos = new Repo.Collection();

      // Set up the commits.
      this.commits = new Commit.Collection();
    },

    useLayout: function(name) {
      // If already using this Layout, then don't re-inject into the DOM.
      if (this.layout && this.layout.options.template === name) {
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
