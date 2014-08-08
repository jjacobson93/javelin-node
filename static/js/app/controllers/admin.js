app.controller('AdminController', ['$scope', '$http', function($scope, $http) {
	$scope.fileUpload = {};

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
		}).error(function(err) {
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
		}).error(function(err) {
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
		}).error(function(err) {
			notify('error', 'Could not organize crews: ' + err.message);
			$scope.organizeInProgress = false;
		});
	};

}]);