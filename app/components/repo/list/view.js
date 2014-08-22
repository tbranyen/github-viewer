define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var Item = require("../item/view");

  var Layout = Backbone.Layout.extend({
    template: require("template!./template"),

    className: "repos-wrapper",

    serialize: function() {
      return { repos: this.collection };
    },

    beforeRender: function() {
      this.collection.each(function(repo) {
        this.insertView("ul", new Item({
          model: repo,

          // Determine if this View is active.
          active: repo.get("name") === app.router.commits.repo
        }));
      }, this);
    },

    initialize: function() {
      // Whenever the collection resets, re-render.
      this.listenTo(this.collection, "sync request reset", this.render);
    }
  });

  module.exports = Layout;
});
