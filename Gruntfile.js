
module.exports = function(grunt) {
	var cssFilesToInject = [
		"./static/bower_components/bootstrap/dist/css/bootstrap.min.css",
		"./static/bower_components/font-awesome/css/font-awesome.min.css",
		"./static/bower_components/select2/select2.css",
		"./static/styles/flat-ui-select2.css",
		"./static/bower_components/fullcalendar/fullcalendar.css",
		"./static/bower_components/angular-bootstrap-toggle-switch/style/bootstrap3/angular-toggle-switch-bootstrap-3.css",
		"./static/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
		"./static/styles/flat-ui-switch.less",
		"./static/styles/pe-icon-7-stroke.css",
		"./static/styles/pe-icon-helper.css",
		"./static/styles/colors.css",
		"./static/styles/fonts.css",
		"./static/bower_components/animate.css/animate.min.css",
		"./static/styles/variables.less",
		"./static/styles/style.less",
		"./static/styles/buttons.less",
		"./static/styles/badges.less",
		"./static/styles/animations.less",
		"./static/styles/typography.less",
		"./static/styles/login.less",
		"./static/styles/navigation.less",
		"./static/styles/marketing.less",
		"./static/styles/notifications.less",
		"./static/styles/form.less",
		"./static/styles/tables.less",
		"./static/styles/panels.less",
		"./static/styles/tabs.less",
		"./static/styles/people.less",
		"./static/styles/groups.less",
		"./static/styles/events.less"
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
	cssFilesToInject = cssFilesToInject.map(function (path) {
		return '.tmp/public/' + path;
	});

	// Modify js file injection paths to use 
	jsFilesToInject = jsFilesToInject.map(function (path) {
		return '.tmp/public/' + path;
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			dev: {
				files: [
					{
					expand: true,
					cwd: './static',
					src: ['**/*.!(coffee)'],
					dest: '.tmp/public'
					}
				]
			},
			build: {
				files: [
					{
					expand: true,
					cwd: '.tmp/public',
					src: ['**/*'],
					dest: 'www'
				}
				]
			}
		},

		clean: {
			dev: ['.tmp/public/**'],
			build: ['www']
		},

		less: {
			dev: {
				files: [
					{
					expand: true,
					cwd: './static/styles/',
					src: ['*.less'],
					dest: '.tmp/public/styles/',
					ext: '.css'
				}
				]
			}
		},

		concat: {
			js: {
				src: jsFilesToInject,
				dest: '.tmp/public/concat/production.js'
			},
			css: {
				src: cssFilesToInject,
				dest: '.tmp/public/concat/production.css'
			}
		},

		uglify: {
			dist: {
				src: ['.tmp/public/concat/production.js'],
				dest: '.tmp/public/min/production.js'
			}
		},

		cssmin: {
			dist: {
				src: ['.tmp/public/concat/production.css'],
				dest: '.tmp/public/min/production.css'
			}
		},

		// 'javelin-linker': {
		// 	devJs: {
		// 		options: {
		// 			startTag: '<!-- SCRIPTS -->',
		// 			endTag: '<!-- SCRIPTS END -->',
		// 			fileTmpl: '<script src="%s"></script>',
		// 			appRoot: '.tmp/public'
		// 		},
		// 		files: {
		// 			'views/index.ejs': jsFilesToInject
		// 		}
		// 	},

		// 	prodJs: {
		// 		options: {
		// 			startTag: '<!--SCRIPTS -->',
		// 			endTag: '<!-- SCRIPTS END -->',
		// 			fileTmpl: '<script src="%s"></script>',
		// 			appRoot: '.tmp/public'
		// 		},
		// 		files: {
		// 			'views/index.ejs': ['.tmp/public/min/production.js']
		// 		}
		// 	},

		// 	devStyles: {
		// 		options: {
		// 			startTag: '<!-- STYLES -->',
		// 			endTag: '<!-- STYLES END -->',
		// 			fileTmpl: '<link rel="stylesheet" href="%s">',
		// 			appRoot: '.tmp/public'
		// 		},

		// 		// cssFilesToInject defined up top
		// 		files: {
		// 			'views/index.ejs': cssFilesToInject
		// 		}
		// 	},

		// 	prodStyles: {
		// 		options: {
		// 			startTag: '<!-- STYLES -->',
		// 			endTag: '<!-- STYLES END -->',
		// 			fileTmpl: '<link rel="stylesheet" href="%s">',
		// 			appRoot: '.tmp/public'
		// 		},
		// 		files: {
		// 			'views/index.ejs': ['.tmp/public/min/production.css']
		// 		}
		// 	},
		// }
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', [
		'compileAssets' //,
		// 'linkAssets'
	]);

	grunt.registerTask('compileAssets', [
		'clean:dev',
		'less:dev',
		'copy:dev',
	]);

	// grunt.registerTask('linkAssets', [

	// 	// Update link/script/template references in `assets` index.html
	// 	'javelin-linker:devJs',
	// 	'javelin-linker:devStyles',
	// ]);


	// Build the assets into a web accessible folder.
	// (handy for phone gap apps, chrome extensions, etc.)
	grunt.registerTask('build', [
		'compileAssets',
		// 'linkAssets',
		'clean:build',
		'copy:build'
	]);

	// When sails is lifted in production
	grunt.registerTask('prod', [
		'clean:dev',
		'less:dev',
		'copy:dev',
		'concat',
		'uglify',
		'cssmin'
		// 'javelin-linker:prodJs',
		// 'javelin-linker:prodStyles'
	]);
};