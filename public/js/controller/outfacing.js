app.controller("outfacing", function($scope,$http,$state, Account, header,database) {
	$scope.databaseItems = {}
	$scope.loginUser = {
		email: "",
		username: "",
		password: ""
	}
	$scope.signupUser = {
		email: "",
		username: "",
		password: ""
	}
	$scope.signup = function () {
		Account.signup($scope.signupUser);
		$scope.signupUser = {username:"",email:"",password:""};
	}
	$scope.signin = function () {
		Account.login($scope.loginUser)
		$scope.loginUser = {username:"",email:"",password:""}
	}
})
