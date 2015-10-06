app.controller('PeopleController', ['$scope', '$http', '$location', '$state', '$timeout', function($scope, $http, $location, $state, $timeout) {
	// $scope.people = [];
	// $scope.$parent.cancelSearch();
	$scope.controllerName = "People";
	$scope.state = $state;

	$scope.currentPerson = undefined;

	var getPerson = function(id) {
		if (id) {
			$http.get('/api/people/' + id).success(function(data) {
				if (data && data != "null") {
					$scope.currentPerson = data;
					$state.go('people.detail', { id: $scope.currentPerson.id });
				} else {
					$state.go('people');
				}
			}).error(function(data, status) {
				if (status == 403) {
					window.location = '/403';
					return;
				}
				$state.go('people');
				notify("error", (data == "Unauthorized") ? "You don't have permission to view that person. Sorry" : "Could not get data");
			});
		} else {
			notify('info', 'No ID given');
		}
	}

	// if ($state.current.name == 'people.detail') {
	// 	getPerson($state.params.id);
	// }

	$scope.personTable = {
		columns: [
			// {
			// 	'key': 'id',
			// 	'label': 'ID'
			// },
			// {
			// 	'key': 'student_id',
			// 	'label': 'Student ID'
			// },
			{ 
				'key': 'last_name',
				'label': 'Last Name',
			},
			{ 
				'key': 'first_name',
				'label': 'First Name',
			},
			{
				'key': 'grad_year',
				'label': 'Grad Year'
			}
		],
		title: 'People',
		getData: {
			url: '/api/people'
		},
		search: $scope.$parent.search,
		classes: 'table table-striped table-hover',
		rowClick: function(row, cb) {
			getPerson(row.id);
		},
		resetWidths: false
	};

	$scope.$watch('state.current.name', function(name) {
		if (name == 'people') {
			$timeout(function() {
				$scope.personTable.resetWidths = true;
			}, 1000);
		} else if (name == 'people.detail') {
			getPerson($state.params.id);
		}
	});

	if (_.contains($scope.currentUser.roles, 'student')) {
		$http.get('/api/people/' + $scope.currentUser.person_id).success(function(data) {
			$scope.currentPerson = data;
			$state.go('people.detail', { id: $scope.currentPerson.id });
		}).error(function(data, status) {
			// $state.go('people');
			if (status == 403) {
				window.location = '/403';
				return;
			}
			notify("error", (data == "Unauthorized") ? "You don't have permission to view that person. Sorry" : "Could not get data");
		});
	}

	// $scope.loadData = function() {
	// 	$http.get('/api/people.json').success(function(people) {
	// 		$scope.people = $scope.personTable.data = people['data'];
	// 	});
	// };

	// $scope.loadData();

	
}]);