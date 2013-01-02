define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var _ = require("underscore");
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Layout = require("layoutmanager");

  // Alias the module for easier identification.
  var app = module.exports;

  // The root path to run the application through.
  app.root = "/";

  // API endpoint.
  app.api = "https://api.github.com/";

  // Useful defaults for GitHub Viewer.
  _.extend(Backbone.Collection.prototype, {
    initialize: function(models, options) {
      // Automatically extend in passed options.
      _.extend(this, options);

      // Listen for request and sync events to control the `isRequest` flag.
      this.on({
        request: function() {
          this.isRequest = true;
        },

        sync: function() {
          this.isRequest = false;
        }
      });

      // By default the collection is not in a request.
      this.isRequest = false;
    },

    parse: function(obj) {
      // Safety check ensuring only valid data is used.
      if (obj.data.message !== "Not Found") {
        return obj.data;
      }

      return this.models;
    }
  });
});
