app.controller('TutoringController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

	$scope.isLoading = true;
	$scope.subjects = [];

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

	$scope.checkIn = function(idx) {
		console.log("Checking in:", $scope.subjects[idx].checkInId);
		$scope.subjects[idx].checkInId = undefined;
	};

	$scope.checkOut = function(idx) {
		console.log("Checking out:", $scope.subjects[idx].checkOutId);
		$scope.subjects[idx].checkOutId = undefined;
	};

	$scope.openAddSubjectModal = function() {
		var modalInstance = $modal.open({
			templateUrl: '/views/tutoring/add_subject',
			controller: 'SubjectAddController',
			// size: 'lg',
			resolve: {}
		})

		modalInstance.result.then(function(subject) {
			$scope.subjects.push(subject);
		});
	};

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