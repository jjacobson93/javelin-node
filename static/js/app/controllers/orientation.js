app.controller('OrientationController', ['$scope', '$state', '$modal', '$q', '$http', function($scope, $state, $modal, $q, $http) {
	$scope.state = $state;
	$scope.crews = [];
	$scope.currentCrew = undefined;

	$scope.getCrew = function(id) {
		$http.get('/api/orientation/crews/' + id).success(function(data) {
			$scope.currentCrew = data;
			$state.go('orientation.crew', { id: data.id });
		}).error(function(err) {
			notify('error', 'Could not get group. Refresh and try again.');
		});
	}

	if ($state.current.name == 'orientation.crew') {
		$scope.getCrew($state.params.id);
	}

	$http.get('/api/orientation/crews').success(function(data) {
		$scope.crews = data;
	}).error(function(err) {
		notify('error', 'There was an error getting crews. Please refresh.');
	});

	// $scope.crewTable = {
	// 	columns: [
	// 		{ 
	// 			'key': 'id',
	// 			'label': 'Crew #',
	// 		},
	// 		{ 
	// 			'key': 'room',
	// 			'label': 'Room',
	// 		}
	// 	],
	// 	title: 'Crews',
	// 	getData: {
	// 		url: '/api/orientation/crews'
	// 	},
	// 	classes: 'table table-hover',
	// 	scope: {
	// 	},
	// 	searchInput: $scope.$parent.searchInput,
	// 	rowClick: function(row) {
	// 		getCrew(row.id);
	// 	},
	// 	reload: false
	// };

	$scope.openCreateCrewModal = function() {
		var modalInstance = $modal.open({
			templateUrl: '/views/orientation/create_crew',
			controller: 'CrewCreateController',
			size: 'lg',
			resolve: {}
		});

		modalInstance.result.then(function(newCrew) {
			$scope.crews.push(newCrew);
		});
	};
}]);

app.controller('CrewCreateController', [
	'$scope', '$http', '$modalInstance', 
	function($scope, $http, $modalInstance) {
		$scope.crew = {};

		$scope.addPeopleSelectOptions = {
			placeholder: 'Search for people',
			multiple: true,
			id: function(person){
				return person.id;
			},
			ajax: {
				url: '/api/people',
				dataType: 'json',
				data: function(term, page){
					return {
						search: term,
						// offset: (page - 1)*20,
						// limit: 20
					};
				},
				results: function(data, page) {
					return {
						results: data.sort(function(a,b) {
							if (a.last_name < b.last_name) {
								return -1;
							} else if (a.last_name > b.last_name) {
								return 1;
							} else if (a.first_name > b.first_name) {
								return -1;
							} else if (a.first_name < b.first_name) {
								return 1;
							} else {
								return 0;
							}
						})
					};
				}
			},
			formatResult: function(person) {
				return person.last_name + ', ' + person.first_name;
			},
			formatSelection: function(person) {
				return person.last_name + ', ' + person.first_name;
			},
		};

		$scope.done = function() {
			var crewData = angular.copy($scope.crew);

			$http.post('/api/orientation/crews', crewData).success(function(returnData) {
				$modalInstance.close(returnData);
			}).error(function(returnData) {
				console.log("Error:", returnData);
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);