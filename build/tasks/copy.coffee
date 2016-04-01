module.exports = ->
  @loadNpmTasks "grunt-contrib-copy"

  # Move vendor and app logic during a build.
  @config "copy",
    release:
      files: [
        src: "bower_components/**", dest: "dist/"
      ]
