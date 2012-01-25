// This is a JavaScript file, you can define any functions you would like in
// here.
config.init({

  clean: {
    folder: "dist/"
  },

  lint: {
    files: ["build/config.js", "app/**/*.js"]
  },

  jshint: {
    options: {
      evil: true
    }
  },

  watch: {
    files: ["app/**/*", "assets/**/*"],
    tasks: "lint:files requirejs",
    
    min: {
      files: "<watch:files>",
      tasks: "default min mincss"
    }
  },

  mincss: {
    "dist/release/style.css": ["assets/css/**/*.css"]
  },

  min: {
    "dist/release/index.js": ["dist/debug/templates.js", "dist/debug/index.js"],
    "dist/release/require.js": ["assets/js/libs/require.js"]
  },

  jst: {
    "dist/debug/templates.js": ["app/templates/**/*.html"]
  },

  server: {
    debug: {
      folders: {
        "app": "dist/debug",
        "app/templates": "app/templates"
      }
    },

    release: {
      files: {
        "app/config.js": "app/config.js"
      },

      folders: {
        "app": "dist/release",
        "app/templates": "app/templates",
        "assets/js/libs": "dist/release",
        "assets/css": "dist/release"
      }
    }
  },

  requirejs: {
    paths: {
      // JavaScript folders
      libs: "../assets/js/libs",
      plugins: "../assets/js/plugins",

      // Libraries
      jquery: "../assets/js/libs/jquery",
      underscore: "../assets/js/libs/underscore",
      backbone: "../assets/js/libs/backbone",

      // Shim Plugin
      use: "../assets/js/plugins/use"
    },

    use: {
      backbone: {
        deps: ["use!underscore", "jquery"],
        attach: "Backbone"
      },

      underscore: {
        attach: "_"
      },
      
      "plugins/backbone.layoutmanager": {
        deps: ["use!backbone"]
      }
    }
  }

});

// Run the following tasks...
task.registerTask("default", "clean lint jst requirejs");
