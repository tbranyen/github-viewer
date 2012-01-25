// ============================================================================
// TASKS
// ============================================================================

task.registerTask("requirejs", "require.js builder", function() {
  var options = config("requirejs") || {};

  // Merge passed options into defaults
  options = underscore.extend({}, {
    // Include the main configuration file
    mainConfigFile: "app/index.js",

    // Do not optimize
    optimize: "none",

    // Show warnings
    logLevel: 2,

    // Ensure modules are inserted
    skipModuleInsertion: false,

    // Output directory
    out: "dist/debug/index.js",

    // Root application module
    name: "index"
  }, options);

  options.use = options.use || {};

  // Default shims for popular libaries
  options.use = underscore.extend({
    backbone: { deps: ["use!underscore", "jquery"] },
    underscore: { attach: "_" }
  }, options.use);

  // Run the r.js helper
  task.helper("r.js", options, function(response) {
    // Print out response
    log.writeln(response);
  });
});

// ============================================================================
// HELPERS
// ============================================================================

// r.js!
task.registerHelper("r.js", function(options, done) {
  console.log(options);
  require("requirejs").optimize(options, done);
});
