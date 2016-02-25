module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			react: {
				files: ['react_components/*/*.jsx'],
				tasks: ['browserify']
			}
		},

		browserify: {
			options: {
				transform: [ require('grunt-react').browserify  ]

			},
			app: {
				src: ['react_components/app.jsx'],
				dest: 'public/javascripts/app.js'
			},
			todoItem: {
				src: ['react_components/todoItem.jsx'],
				dest: 'public/javascripts/todoItem.js'
			},
			todoFooter: {
				src: ['react_components/todoFooter.jsx'],
				dest: 'public/javascripts/todoFooter.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
	'browserify'
	]);
};