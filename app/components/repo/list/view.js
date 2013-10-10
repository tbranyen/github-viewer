define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var Item = require("../item/view");

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    className: "repos-wrapper",

    serialize: function() {
      return { repos: this.options.repos };
    },

    beforeRender: function() {
      this.options.repos.each(function(repo) {
        this.insertView("ul", new Item({
          model: repo,

          // Determine if this View is active.
          active: repo.get("name") === this.options.commits.repo
        }));
      }, this);
    },

    initialize: function() {
      // Whenever the collection resets, re-render.
      this.listenTo(this.options.repos, "sync request reset", this.render);
    }
  });

  module.exports = Layout;
});
