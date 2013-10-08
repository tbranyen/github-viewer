define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var Item = require("../item/view");

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    beforeRender: function() {
      this.options.commits.each(function(commit) {
        this.insertView("table", new Item({
          model: commit,
          repo: this.options.commits.repo,
          user: this.options.commits.user
        }));
      }, this);
    },

    serialize: function() {
      return { commits: this.options.commits };
    },

    initialize: function() {
      this.listenTo(this.options.commits, "reset sync request", this.render);
    }
  });

  module.exports = Layout;
});
