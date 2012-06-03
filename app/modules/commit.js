define([
  // Global application context.
  "app",

  // Third-party libraries.
  "backbone"
],

function(app, Backbone) {

  var Commit = app.module();

  Commit.Collection = Backbone.Collection.extend({
    url: function() {
      return "https://api.github.com/repos/" + this.user + "/" + this.repo +
        "/commits?callback=?";
    },

    parse: function(obj) {
      // Safety check ensuring only valid data is used
      if (obj.data.message !== "Not Found") {
        return obj.data;
      }

      return this.models;
    },

    initialize: function(models, options) {
      if (options) {
        this.user = options.user;
        this.repo = options.repo;
      }
    }
  });

  Commit.Views.Item = Backbone.View.extend({
    template: "commits/item",

    tagName: "tr",

    serialize: function() {
      return { model: this.model };
    }
  });

  Commit.Views.List = Backbone.View.extend({
    tagName: "table",

    className: "table table-striped",

    render: function(manage) {
      this.collection.each(function(commit) {
        this.insertView(new Commit.Views.Item({
          model: commit
        }));
      }, this);

      return manage(this).render();
    },

    cleanup: function() {
      this.collection.off(null, null, this);
    },

    initialize: function() {
      this.collection.on("all", function() {
        this.render();
      }, this);
    }
  });

  // Required, return the module for AMD compliance
  return Commit;

});
