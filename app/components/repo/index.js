define(function(require, exports, module) {
  "use strict";

  module.exports = {
    Collection: require("./collection"),

    Views: {
      Item: require("./item/view"),
      List: require("./list/view")
    }
  };
});
