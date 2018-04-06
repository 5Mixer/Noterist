app.controller("core", function($scope,$http,header) {
	$scope.capitalizeFirstLetter = function(string) {
		if (string == undefined)
			return ""
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
});
