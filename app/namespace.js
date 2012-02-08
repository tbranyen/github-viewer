define([
  // Libs
  "jquery",
  "use!underscore",
  "use!backbone",

  // Plugins
  "use!plugins/backbone.layoutmanager"
],

function($, _, Backbone) {

  // Customize the LayoutManager
  Backbone.LayoutManager.configure({
    paths: {
      layout: "app/templates/layouts/",
      template: "app/templates/"
    },

    fetch: function(path) {
      path = path + ".html";

      var done = this.async();
      var JST = window.JST = window.JST || {};
      
      // Should be an instant synchronous way of getting the template, if it
      // exists in the JST object.
      if (JST[path]) {
        return done(JST[path]);
      }

      // Fetch it asynchronously if not available from JST
      require([
        'util/text!' + path
      ], function(tmpl) {
        JST[path] = tmpl;
        done(tmpl);
      });
    },

    render: function(template, context) {
      return template(context);
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
