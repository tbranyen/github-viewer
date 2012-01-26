define([
  "namespace",

  // Libs
  "use!backbone",

  // Plugins
  "use!plugins/backbone.layoutmanager"
],

function(bocoup, Backbone) {

  // Shorthand the app
  var app = bocoup.app;

  // Create a new module
  var Commit = bocoup.module();

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

  Commit.Views.Item = Backbone.LayoutManager.View.extend({
    template: "commits/item",

    tagName: "li",

    serialize: function() {
      return this.model.toJSON();
    }
  });

  Commit.Views.List = Backbone.View.extend({
    template: "commits/list",

    render: function(layout) {
      var view = layout(this);

      this.collection.each(function(commit) {
        view.insert("ul", new Commit.Views.Item({
          model: commit
        }));
      });

      return view.render();
    },

    initialize: function() {
      this.collection.bind("reset", function() {
        this.render();
      }, this);
    }
  });

  // Required, return the module for AMD compliance
  return Commit;

});
