define([
  // Libs
  "jquery",
  "lodash",
  "backbone",

  // jQuery plugins
  "vendor/bootstrap/js/bootstrap",

  // Backbone plugins
  "plugins/backbone.layoutmanager"
],

function($, _, Backbone) {

  // Create or attach to the global JavaScript Template cache.
  var JST = window.JST = window.JST || {}; 

  // Configure LayoutManager
  Backbone.LayoutManager.configure({
    paths: {
      layout: "app/templates/layouts/",
      template: "app/templates/"
    },

    fetch: function(path) {
      path = path + ".html";

      if (!JST[path]) {
        $.ajax({ url: "/" + path, async: false }).then(function(contents) {
          JST[path] = _.template(contents);
        });
      } 
      
      return JST[path];
    }
  });

  return {
    // Create a custom object with a nested Views object
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Keep active application instances namespaced under an app object.
    app: _.extend({}, Backbone.Events)
  };

});
