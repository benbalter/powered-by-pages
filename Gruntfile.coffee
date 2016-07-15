module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      compile:
        options:
          sourceMap: true
        files:
          'dist/script.js': 'src/script.coffee'

    watch:
      scripts:
        files: [ 'src/*.coffee' ]
        tasks: 'coffee'

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'build', ['coffee']
  grunt.registerTask 'default', ['build']
