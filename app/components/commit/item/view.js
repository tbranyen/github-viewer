define(function(require, exports, module) {
  "use strict";

  var Layout = require("layoutmanager");

  var CommitItemView = Layout.extend({
    template: require("ldsh!./template"),

    el: false,

    serialize: function() {
      return {
        model: this.model,
        repo: this.options.repo,
        user: this.options.user
      };
    }
  });

  module.exports = CommitItemView;
});
