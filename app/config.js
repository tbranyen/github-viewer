require.config({
  paths: {
    // Make vendor easier to access.
    "vendor": "../vendor",

    // Almond is used to lighten the output filesize.
    "almond": "../vendor/bower/almond/almond",

    // Opt for Lo-Dash Underscore compatibility build over Underscore.
    "underscore": "../vendor/bower/lodash/dist/lodash.underscore",

    // Map `lodash` to a valid location for the template loader plugin.
    "lodash": "../vendor/bower/lodash/dist/lodash",

    // Use the Lo-Dash template loader.
    "ldsh": "../vendor/bower/lodash-template-loader/loader",

    // Map remaining vendor dependencies.
    "jquery": "../vendor/bower/jquery/jquery",
    "backbone": "../vendor/bower/backbone/backbone",
    "bootstrap": "../vendor/bower/bootstrap/dist/js/bootstrap",
    "layoutmanager": "../vendor/bower/layoutmanager/backbone.layoutmanager",
    "cacheit": "../vendor/bower/backbone.cacheit/backbone.cacheit"
  },

  shim: {
    // This is required to ensure Backbone works as expected within the AMD
    // environment.
    "backbone": {
      // These are the two hard dependencies that will be loaded first.
      deps: ["jquery", "underscore"],

      // This maps the global `Backbone` object to `require("backbone")`.
      exports: "Backbone"
    },

    // Twitter Bootstrap depends on jQuery.
    "bootstrap": ["jquery"]
  },

  lodashLoader: {
    root: "/app/templates/"
  }
});
