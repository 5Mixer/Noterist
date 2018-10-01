//reset.js - Response to reset email with new password form
//forgot.js - Request for reset email

app.controller("reset", function($scope,$http,Account,$stateParams) {
	$scope.newPassword = ""
	$scope.resetPassword = function () {
		Account.reset($stateParams.token, $scope.newPassword)
	}
})
