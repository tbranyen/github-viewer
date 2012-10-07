define([
  // Global application context.
  "app",

  // Third-party libraries.
  "backbone"
],

function(app, Backbone) {

  var Commit = app.module();

  Commit.Model = Backbone.Model.extend({
    defaults: function() {
      return {
        commit: {}
      };
    }
  });

  Commit.Collection = Backbone.Collection.extend({
    model: Commit.Model,

    cache: true,

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
    template: "commit/item",

    tagName: "tr",

    serialize: function() {
      return {
        model: this.model,
        repo: this.options.repo,
        user: this.options.user
      };
    }
  });

  Commit.Views.List = Backbone.View.extend({
    tagName: "table",

    className: "table table-striped",

    beforeRender: function() {
      this.$el.children().remove();

      this.options.commits.each(function(commit) {
        this.insertView(new Commit.Views.Item({
          model: commit,
          repo: this.options.commits.repo,
          user: this.options.commits.user
        }));
      }, this);
    },

    cleanup: function() {
      this.options.commits.off(null, null, this);
    },

    initialize: function() {
      this.options.commits.on("reset", this.render, this);

      this.options.commits.on("fetch", function() {
        this.$el.html("<img src='/assets/img/spinner.gif'>");
      }, this);
    }
  });

  // Required, return the module for AMD compliance
  return Commit;

});
