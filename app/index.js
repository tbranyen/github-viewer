// Set the require.js configuration for your application.
require.config({
  paths: {
    // JavaScript folders
    libs: "../assets/js/libs",
    plugins: "../assets/js/plugins",

    // Libraries
    jquery: "../assets/js/libs/jquery",
    underscore: "../assets/js/libs/underscore",
    backbone: "../assets/js/libs/backbone",

    // Plugins
    use: "../assets/js/plugins/use"
  },

  use: {
    backbone: {
      deps: ["use!underscore", "jquery"],
      attach: "Backbone"
    },

    underscore: {
      attach: "_"
    },
    
    "plugins/backbone.layoutmanager": {
      deps: ["use!backbone"]
    },

    "plugins/jquery.ba-throttle-debounce": {
      deps: ["jquery"]
    }
  }
});

require([
  "namespace",

  // Libs
  "jquery",
  "use!backbone",

  // Modules
  "modules/repo",
  "modules/user",
  "modules/commit"
],

function (bocoup, jQuery, Backbone, Repo, User, Commit) {
  // Treat the jQuery ready function as the entry point to the application.
  // Inside this function, kick-off all initialization, everything up to this
  // point should be definitions.
  jQuery(function($) {

    // Shorthand the application namespace
    var app = bocoup.app;

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
      // Super-simple layout swapping and reusing
      useLayout: function(name) {
        var currentLayout = this.currentLayout;

        // If there is an existing layout and its the current one, return it.
        if (currentLayout && currentLayout.options.template == name) {
          return currentLayout;
        }

        // Create the new layout and set it as current.
        this.currentLayout = new Backbone.LayoutManager({
          template: name
        });

        return this.currentLayout;
      },

      routes: {
        "": "index"
      },

      index: function() {
        var main = this.useLayout("main");

        app.repos = new Repo.Collection();

        app.users = new User.Collection([], { org: "bocoup" });
        app.users.fetch();

        app.commits = new Commit.Collection();

        // Set all the views
        main.setViews({
          ".repos": new Repo.Views.List({
            collection: app.repos
          }),

          ".users": new User.Views.List({
            collection: app.users
          }),

          ".commits": new Commit.Views.List({
            collection: app.commits
          })
        });

        // Render to the page
        main.render(function(el) {
          $("#main").html(el);
        });
      }
    });
    
    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new Router();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start({ pushState: true });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router.  If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on("click", "a:not([data-bypass])", function(evt) {
      // Get the anchor href and protcol
      var href = $(this).attr("href");
      var protocol = this.protocol + "//";

      // Ensure the protocol is not part of URL, meaning its relative.
      if (href.slice(0, protocol.length) !== protocol) {
        // Stop the default event to ensure the link will not cause a page
        // refresh.
        evt.preventDefault();

        // This uses the default router defined above, and not any routers
        // that may be placed in modules.  To have this work globally (at the
        // cost of losing all route events) you can change the following line
        // to: Backbone.history.navigate(href, true);
        app.router.navigate(href, true);
      }
    });

  });
});
