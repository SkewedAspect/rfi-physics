//----------------------------------------------------------------------------------------------------------------------
// RFI Physics Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    'dist/rfi-physics.js': ['./index.js']
                }
            }
        },
        clean: ['dist'],
        watch: {
            browserify: {
                files: ['<%= project.js %>'],
                tasks: ['browserify'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Setup the build task.
    grunt.registerTask('build', ['clean', 'browserify']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------
