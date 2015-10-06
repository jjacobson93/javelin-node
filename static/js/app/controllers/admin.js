app.controller('AdminController', ['$scope', '$state', '$http', '$modal', function($scope, $state, $http, $modal) {
	$scope.state = $state;
	$scope.users = [];
	$scope.isSending = false;
	$scope.fileUpload = {};

	$scope.getUsers = function() {
		$http.get('/api/users').success(function(users) {
			$scope.users = users;
			_.each($scope.users, function(user) {
				user.roles = _.pluck(user.roles, 'name');
			});
		}).error(function(err, status) {
			if (status == 403) {
				window.location = '/403';
				return;
			}
			notify('error', "Error getting users.");
		});
	};

	$scope.resendInvitation = function(user) {
		$scope.isSending = true;
		if (user && user.id) {
			$http.post('/api/users/' + user.id + '/resend-invite', {

			}).success(function(username) {
				notify('success', 'Sent invitation to ' + user + '!');
				$scope.isSending = false;
			}).error(function(err, status) {
				if (status == 403) {
					window.location = '/403';
					return;
				}
				notify('error', 'There was an error trying to send the invitation. Please refresh and try again.');
				$scope.isSending = false;
			});

		} else {
			notify('error', "User doesn't exist");
		}
	}

	$scope.deactivateUser = function(user) {
		$http.put('/api/users/' + user.id, {
			active: false
		}).success(function(user) {
			notify('success', 'User is deactivated');
		}).error(function(err, status) {
			if (status == 403) {
				window.location = '/403';
				return;
			}
			notify('error', 'There was an error trying to deactivate the user.');
		});
	};

	$scope.fileUpload.change = function(files) {
		$scope.fileUpload.csvFileLeaders = files[0]
	}

	$scope.submitImportLeaders = function() {
		$scope.importInProgress = true;
		$http({
			method: "POST",
			url: "/api/orientation/import-leaders",
			headers : {
				'Content-Type': undefined
			},
			data: {
				csvFile: $scope.fileUpload.csvFileLeaders
			},
			transformRequest: function(data) {
				var fd = new FormData();
				angular.forEach(data, function(value, key) {
					fd.append(key, value);
				});
				return fd;
			}
		}).success(function(data) {
			document.forms['import-leaders'].reset();
			notify('success', 'Success! Leaders were imported!');
			$scope.importInProgress = false;
		}).error(function(err, status) {
			if (status == 403) {
				window.location = '/403';
				return;
			}
			notify('error', 'Could not import leaders: ' + err.message);
			$scope.importInProgress = false;
		});
	};

	$scope.submitImportStudents = function() {
		$scope.importInProgress = true;

		$http({
			method: "POST",
			url: "/api/admin/import-students",
			headers : {
				'Content-Type': undefined
			},
			data: {
				csvFile: $scope.fileUpload.csvFileLeaders
			},
			transformRequest: function(data) {
				var fd = new FormData();
				angular.forEach(data, function(value, key) {
					fd.append(key, value);
				});
				return fd;
			}
		}).success(function(data) {
			document.forms['import-students'].reset();
			notify('success', 'Success! Students were imported!');
			$scope.importInProgress = false;
		}).error(function(err, status) {
			if (status == 403) {
				window.location = '/403';
				return;
			}
			notify('error', 'Could not import students: ' + err.message);
			$scope.importInProgress = false;
		});
	};

	$scope.organizeCrews = function() {
		$scope.organizeInProgress = true;

		$http({
			method: "POST",
			url: "/api/orientation/organize-crews",
		}).success(function(data) {
			notify('success', 'Success! Crews were organized!');
			$scope.organizeInProgress = false;
		}).error(function(err, status) {
			if (status == 403) {
				window.location = '/403';
				return;
			}
			notify('error', 'Could not organize crews: ' + err.message);
			$scope.organizeInProgress = false;
		});
	};

	$scope.openAddUserModal = function(person) {
		var modalInstance = $modal.open({
			templateUrl: '/views/admin/add_user_modal',
			controller: 'AddUserModalController',
			resolve: {
				person: person
			}
		});

		modalInstance.result.then(function(data) {
			console.log(data);
		});
	};

	$scope.getUsers();

}]);

app.controller('AddUserModalController', ['$scope', '$http', '$modalInstance', function($scope, $http, $modalInstance) {
	$scope.newUser = {};
	$scope.isSending = false;

	// $scope.personDropdown = {
	// 	placeholder: 'Value',
	// 	query: function(query) {
			
	// 		$http.get('/api/people', {
	// 			params: {
	// 				search: query.term,
	// 			}
	// 		}).success(function(data) {
	// 			query.callback({
	// 				results: data,
	// 				more: false
	// 			});
	// 		}).error(function(data) {
	// 			query.callback({results: [], more: false});
	// 		});
	// 	},
	// 	formatResult: function(person) {
	// 		return person.last_name + ', ' + person.first_name + ((person.student_id) ? ' (' + person.student_id + ')' : '');
	// 	},
	// 	formatSelection: function(person) {
	// 		return person.last_name + ', ' + person.first_name + ((person.student_id) ? ' (' + person.student_id + ')' : '');
	// 	},
	// 	createSearchChoice: function(term) {
	// 		console.log(term);
	// 	}
	// }

	$scope.personDropdown = {
		placeholder: 'Search for a person',
		id: function(person){
			return person.id;
		},
		ajax: {
			url: '/api/people/non-users',
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
			return person.last_name + ', ' + person.first_name + ((person.student_id) ? ' (' + person.student_id + ')' : '');
		},
		formatSelection: function(person) {
			return person.last_name + ', ' + person.first_name + ((person.student_id) ? ' (' + person.student_id + ')' : '');
		}
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.addUser = function() {
		$scope.isSending = true;
		$http.post('/api/users', {
			email: $scope.newUser.email,
			person_id: $scope.newUser.person.id
		}).success(function(user) {
			notify('success', 'Sent invitation to ' + user.username + '!');
			$scope.isSending = false;
			$modalInstance.close(user);
		}).error(function(err, status) {
			if (status == 403) {
				window.location = '/403';
				return;
			}
			notify('error', 'There was an error trying to send the invitation. Please refresh and try again.');
			$scope.isSending = false;
		});
	}
}]);