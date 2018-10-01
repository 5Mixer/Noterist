//forgot.js - Request for reset email
//reset.js - Response to reset email with new password form
app.controller("forgot", function($scope,$http,Account) {
	$scope.forgotEmail = ""
	$scope.forgot = function () {
		Account.forgot($scope.forgotEmail)
	}
})
