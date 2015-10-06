var app = angular.module('JavelinApp',
	['ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate', 
	'ui.bootstrap', 'ui.calendar', 'ui.router', 'ui.select2', 
	'toggle-switch']
	// ['$interpolateProvider', function($interpolateProvider) {
	// 	$interpolateProvider.startSymbol('{[');
	// 	$interpolateProvider.endSymbol(']}');
	// }]
	);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 
	function($stateProvider, $urlRouterProvider, $httpProvider) {
		$httpProvider.responseInterceptors.push(['$q', '$location', function ($q, $location) {
			function success(response) {
				return response;
			}

			function error(response) {
				var status = response.status;

				if (status == 401 || status == 403) {
					window.location = "/" + status;
					return;
				}

	            // otherwise
	            return $q.reject(response);
	        }

	        return function (promise) {
	        	return promise.then(success, error);
	        }

	    }])

		$urlRouterProvider.otherwise(function($injector, $location) {
			$injector.invoke(['AuthService', '$window', function(AuthService, $window) {
				var isAuthenticated = AuthService.isAuthenticated();
				// $location.path((isAuthenticated) ? '/' : '/login');
				if (!isAuthenticated) {
					$location.path('/login');
				} else {
					if ($location.path() == '') $location.path('/'); 
					else $window.location = '/404';
				}
			}]);
		});

		$stateProvider	
		.state('login', {
			url: '/login',
			templateUrl: '/views/login'
		})

		.state('register', {
			url: '/register/:key',
			templateUrl: '/views/register',
			controller: 'RegisterController'
		})

		.state('dashboard', {
			url: '/',
			templateUrl: '/views/dashboard',
			controller: 'DashboardController'
		})

		.state('people', {
			url: '/people',
			templateUrl: '/views/people',
			controller: 'PeopleController'
		})

			.state('people.detail', {
				url: '/:id'
			})

		.state('groups', {
			url: '/groups',
			templateUrl: '/views/groups',
			controller: 'GroupsController'
		})

			.state('groups.detail', {
				url: '/:id',
			})

		.state('events', {
			url: '/events',
			templateUrl: '/views/events',
			controller: 'EventsController'
		})

			.state('events.attendance', {
				url: '/:id',
			})

		.state('orientation', {
			url: '/orientation',
			templateUrl: '/views/orientation',
			controller: 'OrientationController'
		})

			.state('orientation.crew', {
				url: '/:id',
			})

		.state('tutoring', {
			url: '/tutoring',
			templateUrl: '/views/tutoring',
			controller: 'TutoringController'
		})

		.state('admin', {
			url: '/admin',
			templateUrl: '/views/admin',
			controller: 'AdminController'
		})

			.state('admin.users', {
				url: '/users'
			})

			.state('admin.imports', {
				url: 'imports'
			})
	}
	]);

app.run(['$rootScope', '$state', '$window', 'AuthService', function($rootScope, $state, $window, AuthService) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		var isAuthenticated = AuthService.isAuthenticated();
		
		if ((toState.name != 'register' && toState.name != 'login' && !isAuthenticated) ||
			(toState.name == 'login' && isAuthenticated)) {
			// $state.transitionTo('login')
		$window.location = '/'
		event.preventDefault();
		return;
	}
})
}]);