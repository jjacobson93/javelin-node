app.controller('TutoringController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {
	$scope.subjects = [];

	function loadAttendance() {
		$scope.isLoading = true;

		var now = moment();
		var start = now.startOf('day').valueOf();
		var end = now.endOf('day').valueOf();

		$http.get('/api/tutoring/subjects', {
			params: {
				start: start,
				end: end
			}
		}).success(function(data) {
			$scope.subjects = data;
			$scope.isLoading = false;
		}).error(function(data) {
			console.log("ERROR:", data);
			$scope.isLoading = false;
		});
	}

	function reloadSubjects() {
		var now = moment();
		var start = now.startOf('day').valueOf();
		var end = now.endOf('day').valueOf();

		$http.get('/api/tutoring/subjects/', {
			params: {
				start: start,
				end: end
			}
		}).success(function(data) {
			for (var i = 0; i < data.length; i++) {
				if ($scope.subjects.length > i) {
					if (!$scope.subjects[i].tutoringAttendances) $scope.subjects[i].tutoringAttendances = [];
					angular.extend($scope.subjects[i].tutoringAttendances, data[i].tutoringAttendances);
				} else {
					$scope.subjects.push(data[i]);
				}
			};
			// angular.extend($scope.subjects, data);
			// angular.extend($scope.subjects[idx].tutoringAttendances, data.tutoringAttendances);
		}).error(function(err) {
			notify('error', 'There was an error loading attendance. Please refresh and try again.');
		});
	}

	$scope.checkIn = function(idx) {
		// console.log("Checking in:", $scope.subjects[idx].checkInId);
		$http.post('/api/tutoring/subjects/' + $scope.subjects[idx].id, {
			person_id: $scope.subjects[idx].checkInId
		}).success(function(data) {
			reloadSubjects();
			$scope.subjects[idx].checkInId = undefined;
		}).error(function(err) {
			notify('error', 'There was an error checking in that attendee. Please refresh and try again.');
		});
	};

	$scope.checkOut = function(idx) {
		// console.log("Checking out:", $scope.subjects[idx].checkOutId);
		$http.put('/api/tutoring/subjects/' + ((idx > -1) ? $scope.subjects[idx].id : 0), {
			person_id: $scope.checkOutId
		}).success(function(data) {
			reloadSubjects();
			$scope.checkOutId = undefined;
		}).error(function(err) {
			notify('error', 'There was an error checking out that attendee. Please refresh and try again.');
		});
	};

	$scope.checkedIn = function(attendees) {
		return (attendees) ? attendees.filter(function(att) {
			return !att.out_time;
		}).length : 0;
	};

	$scope.timeDiff = function(a, b) {
		a = moment(a);
		b = moment(b);
		var d = moment.duration(b - a);
		var sec = Math.round(d._milliseconds/1000);
		var ss = sec % 60;
		var mm = (sec - ss)/60;
		var hh = (mm - (mm % 60))/60;
		var mm = mm % 60;
		var days = (hh - (hh % 24))/24;
		var hh = hh % 24;
		var s = hh + ":" + pad(mm) + ":" + pad(ss);

		if (days) {
			s = days + " day" + (days != 1 ? "s, " : ", ") + s;
		}

		return s;
	};

	$scope.totalCheckedIn = function() {
		return sum(map($scope.subjects, function(subject) {
			return $scope.checkedIn(subject.tutoringAttendances);
		}));
	};

	$scope.openAddSubjectModal = function() {
		var modalInstance = $modal.open({
			templateUrl: '/views/tutoring/add_subject',
			controller: 'SubjectAddController',
			// size: 'lg',
			resolve: {}
		})

		modalInstance.result.then(function(subject) {
			for (var i = 0; i < $scope.subjects.length; i++) {
				var title = $scope.subjects[i].title;
				if (title.toLowerCase() > subject.title.toLowerCase()) {
					$scope.subjects.splice(i, 0, subject);
					return;
				}
			};
		});
	};

	loadAttendance();

}]);

app.controller('SubjectAddController', [
	'$scope', '$http', '$modalInstance', 
	function($scope, $http, $modalInstance) {
		$scope.subject = {};

		$scope.departmentSelect = {
			placeholder: "Search for a department",
			allowClear: true,
			ajax: {
				url: "/api/departments",
				dataType: "json",
				data: function(term, page) {
					return {
						name: term
					};
				},
				results: function(data, page) {
					return { results: data, text: 'name' } 
				}
			},
			formatResult: function(department) {
				return department.name;
			},
			formatSelection: function(department) {
				return department.name;
			}
		};

		$scope.done = function() {
			// Prep object
			var subject = angular.copy($scope.subject);
			if (subject.department) {
				subject.department_id = subject.department.id;
			}
			delete(subject.department);

			$http.post('/api/tutoring/subjects', subject).success(function(data) {
				$modalInstance.close(data);
			}).error(function(err) {
				notify('error', 'Could not add subject. Please refresh and try again.');
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
	]);