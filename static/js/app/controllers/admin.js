app.controller('AdminController', ['$scope', '$http', function($scope, $http) {
	$scope.fileUpload = {};

	$scope.fileUpload.change = function(files) {
		$scope.fileUpload.csvFile = files[0]
	}

	$scope.submitImportLeaders = function() {
		$http({
			method: "POST",
			url: "/api/orientation/import-leaders",
			headers : {
				'Content-Type': undefined
			},
			data: {
				csvFile: $scope.fileUpload.csvFile
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
		}).error(function(err) {
			notify('error', 'Could not import leaders: ' + err.message);
		});
	}

}]);