define(function(require, exports, module) {
  "use strict";

  var app = require("app");
  var Item = require("../item/view");

  var Layout = Backbone.Layout.extend({
    template: require("ldsh!./template"),

    beforeRender: function() {
      this.collection.each(function(commit) {
        this.insertView("table", new Item({
          model: commit,
          repo: this.collection.repo,
          user: this.collection.user
        }));
      }, this);
    },

    serialize: function() {
      return { commits: this.collection };
    },

    initialize: function() {
      this.listenTo(this.collection, "reset sync request", this.render);
    }
  });

  module.exports = Layout;
});
