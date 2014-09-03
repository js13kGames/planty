module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          './build/js/js.js': ['./js/js.js']
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          './build/css/css.css' : ['./css/css.css']
        }
      }
    },

    htmlmin: {
      combine: {
        files: {
          './build/index.html' : ['./index.html']
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin', 'htmlmin']);

};