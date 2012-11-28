// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file and the JamJS
  // generated configuration file.
  deps: ["../vendor/jam/require.config", "main"],

  paths: {
    // JavaScript folders.
    plugins: "../vendor/js/plugins",
    vendor: "../vendor"
  },

  shim: {
    // Backbone.CollectionCache depends on Backbone.
    "plugins/backbone.collectioncache": ["backbone"],

    // Twitter Bootstrap depends on jQuery.
    "vendor/bootstrap/js/bootstrap": ["jquery"]
  }

});
