app.controller('RegisterController', ['$scope', '$state', '$http', function($scope, $state, $http) {
	$scope.user = {};
	$scope.register = {};
	$scope.isLoading = true;

	$http.get('/api/users/invitation/' + $state.params.key).success(function(user) {
		$scope.user = user;
		$scope.register.username = user.username;
		$scope.isLoading = false;
	}).error(function(err) {
		notify('error', 'There was an error getting your user account. Please refresh.');
	});

	$scope.confirmPassword = function() {
		return $scope.register.password && $scope.register.confirmPassword && ($scope.register.password === $scope.register.confirmPassword);
	};
}]);