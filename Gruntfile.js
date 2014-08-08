
module.exports = function(grunt) {
	var cssFilesToInject = [
		"./static/bower_components/bootstrap/dist/css/bootstrap.min.css",
		"./static/bower_components/font-awesome/css/font-awesome.min.css",
		"./static/bower_components/select2/select2.css",
		"./static/styles/flat-ui-select2.css",
		"./static/bower_components/fullcalendar/fullcalendar.css",
		"./static/bower_components/angular-bootstrap-toggle-switch/style/bootstrap3/angular-toggle-switch-bootstrap-3.css",
		"./static/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
		"./static/styles/pe-icon-7-stroke.css",
		"./static/styles/pe-icon-helper.css",
		"./static/styles/colors.css",
		"./static/styles/fonts.css",
		"./static/bower_components/animate.css/animate.min.css",
		// ".tmp/styles/variables.css",
		"./.tmp/styles/flat-ui-switch.css",
		"./.tmp/styles/style.css",
		"./.tmp/styles/buttons.css",
		"./.tmp/styles/badges.css",
		"./.tmp/styles/animations.css",
		"./.tmp/styles/typography.css",
		"./.tmp/styles/login.css",
		"./.tmp/styles/navigation.css",
		"./.tmp/styles/marketing.css",
		"./.tmp/styles/notifications.css",
		"./.tmp/styles/form.css",
		"./.tmp/styles/tables.css",
		"./.tmp/styles/panels.css",
		"./.tmp/styles/tabs.css",
		"./.tmp/styles/people.css",
		"./.tmp/styles/groups.css",
		"./.tmp/styles/events.css"
	];

	var jsFilesToInject = [
		"./static/bower_components/jquery/dist/jquery.min.js",
		"./static/bower_components/underscore/underscore.js",
		"./static/bower_components/moment/min/moment.min.js",
		"./static/bower_components/bootstrap/dist/js/bootstrap.min.js",
		"./static/bower_components/angular/angular.min.js",
		"./static/bower_components/angular-route/angular-route.min.js",
		"./static/bower_components/angular-resource/angular-resource.min.js",
		"./static/bower_components/angular-sanitize/angular-sanitize.min.js",
		"./static/bower_components/angular-animate/angular-animate.min.js",
		"./static/bower_components/angular-ui-bootstrap/dist/ui-bootstrap-tpls-0.11.0.min.js",
		"./static/bower_components/angular-ui-router/release/angular-ui-router.min.js",
		"./static/bower_components/angular-bootstrap-toggle-switch/angular-toggle-switch.min.js",
		"./static/bower_components/angular-scroll/angular-scroll.min.js",
		"./static/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js",
		"./static/bower_components/select2/select2.min.js",
		"./static/bower_components/angular-ui-select2/src/select2.js",
		"./static/bower_components/jquery-ui/ui/minified/jquery-ui.custom.min.js",
		"./static/bower_components/fullcalendar/fullcalendar.js",
		"./static/bower_components/angular-ui-calendar/src/calendar.js",
		"./static/js/app/main.js",
		"./static/js/app/util.js",
		"./static/js/app/controllers/main.js",
		"./static/js/app/controllers/dashboard.js",
		"./static/js/app/controllers/people.js",
		"./static/js/app/controllers/groups.js",
		"./static/js/app/controllers/events.js",
		"./static/js/app/controllers/orientation.js",
		"./static/js/app/controllers/tutoring.js",
		"./static/js/app/controllers/admin.js",
		"./static/js/app/controllers/messages.js",
		"./static/js/app/directives.js",
		"./static/js/app/filters.js",
		"./static/js/app/factories.js",
		"./static/js/app/services.js"
	];

	// Modify css file injection paths to use 
	// cssFilesToInject = cssFilesToInject.map(function (path) {
	// 	return '.tmp/public/' + path;
	// });

	// // Modify js file injection paths to use 
	// jsFilesToInject = jsFilesToInject.map(function (path) {
	// 	return '.tmp/public/' + path;
	// });

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// copy: {
		// 	build: {
		// 		files: [
		// 			{
		// 			expand: true,
		// 			cwd: 'static',
		// 			src: ['**/*.*'],
		// 			dest: '.tmp/public/static'
		// 			}
		// 		]
		// 	}
		// },

		clean: {
			build: ['.tmp/**'],
		},

		less: {
			build: {
				files: [
					{
					expand: true,
					cwd: 'static/styles/',
					src: ['*.less'],
					dest: '.tmp/styles/',
					ext: '.css'
				}
				]
			}
		},

		concat: {
			js: {
				src: jsFilesToInject,
				dest: '.tmp/concat/production.js'
			},
			css: {
				src: cssFilesToInject,
				dest: '.tmp/concat/production.css'
			}
		},

		uglify: {
			build: {
				src: ['.tmp/concat/production.js'],
				dest: 'static/dist/production.min.js'
			}
		},

		cssmin: {
			build: {
				src: ['.tmp/concat/production.css'],
				dest: 'static/dist/production.min.css'
			}
		},

		watch: {
			js: {
				files: ['static/js/**/*'],
				tasks: ['default']
			},
			styles: {
				files: ['static/styles/*'],
				tasks: ['default']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', [
		'clean',
		'less:build',
		'concat',
		'uglify',
		'cssmin',
		'clean'
	]);

};