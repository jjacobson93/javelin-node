app.controller('OrientationController', ['$scope', '$state', '$modal', '$q', '$http', function($scope, $state, $modal, $q, $http) {
	$scope.state = $state;
	$scope.crews = [];
	$scope.currentCrew = undefined;
	$scope.orientation = {};
	$scope.orientation.peopleToAdd = [];
	$scope.test = undefined;

	$scope.getCrew = function(id) {
		$http.get('/api/orientation/crews/' + id).success(function(data) {
			if (data != "null") {
				$scope.currentCrew = data;
				if ($state.current.name != 'orientation.crew')
					$state.go('orientation.crew', { id: data.id });
			} else {
				$state.go('orientation');
			}
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

	$scope.addPersonDropdown = {
		placeholder: 'Search for people',
		multiple: true,
		allowClear: true,
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
		}
	}

	$scope.addPeopleToCrew = function(crewId) {
		$http.post('/api/orientation/crews/' + crewId + '/members', {
			people: $scope.orientation.peopleToAdd.map(function(p) {
				return p.id;
			})
		}).success(function(people) {
			$scope.orientation.peopleToAdd = [];
			$scope.getCrew(crewId);
			notify('success', 'Added people to Crew #' + crewId);
		}).error(function(err) {
			console.error(err);
			notify('error', 'There was an error adding people');
		});
	};

	$scope.openCreateCrewModal = function() {
		var modalInstance = $modal.open({
			templateUrl: '/views/orientation/create_crew',
			controller: 'CrewCreateController',
			resolve: {}
		});

		modalInstance.result.then(function(newCrew) {
			$scope.crews.push(newCrew);
		});
	};

	$scope.openRemoveFromCrewModal = function(crew, person, idx) {
		var modalInstance = $modal.open({
			templateUrl: '/views/orientation/remove_from_crew',
			controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
				$scope.crew = crew;
				$scope.person = person;

				$scope.removeFromCrew = function() {
					$http.delete('/api/orientation/crews/' + crew.id + '/members/' + person.id).success(function(data) {
						notify('success', "'" + person.first_name + ' ' + person.last_name + "' has been deleted.");

						$modalInstance.close(data);
					}).error(function(err) {
						notify('error', "There was an error deleting '" + person.first_name + ' ' + person.last_name + "'. Please try again.");
						$modalInstance.dismiss(err);
					});
				};

				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			}],
			size: 'sm'
		});

		modalInstance.result.then(function() {
			$scope.currentCrew.crewMembers.splice(idx, 1);
		});
	};

	$scope.updateCrewScore = function(crew) {
		$http.put('/api/orientation/crews/' + crew.id, {
			score: crew.score
		}).success(function(data) {

		}).error(function(err) {
			notify('error', 'There was an error updating crew score. Please refresh and try again.')
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