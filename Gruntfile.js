module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            src: {
                src: ['src/js/*.js'],
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        },
        concat: {
			build: {
				options: {
					banner: "(function($){\n",
					footer: "\n})(jQuery);"
				},
				src: [
                    'src/js/feed.js',
                    'src/js/setup.js'],
				dest:'build/js/<%= pkg.name %>.js'
			}
		},
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/js/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        cssmin: {
			combine: {
				files:{
					'build/css/<%= pkg.name %>.min.css': ['src/css/*.css']
				}
			},
			minify: {
				expand: true,
				cwd: 'build/css/',
				src: ['*.css'],
				dest: 'dist/'
			}
		},
    });
    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Load the plugin that provides the "cssmin" taks.
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);
};