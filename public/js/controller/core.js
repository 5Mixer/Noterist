app.directive("fileread", [function () {
	return {
		scope: {
			fileread: "="
		},
		link: function (scope, element, attributes) {
			element.bind("change", function (changeEvent) {
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					console.log(loadEvent.target.result)
					scope.$apply(function () {
						scope.fileread = loadEvent.target.result;
					});
				}
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
	}
}]);

app.controller("core", function($scope,$http) {
	$scope.search = ""
	$scope.cards = []

	$scope.newcard = {title:"",tags:"",file:undefined}

	$scope.newCard = function () {
		$http({
			method  : 'POST',
			url     : '/cards',
			data    : $scope.newcard,
			headers : { 'Content-Type': "application/json" }  // set the headers so angular passing info as form data (not request payload)
		})
	}

	$scope.delete = function(card){
		$http({
			method: "DELETE",
			url : "/cards",
			data: card,
			headers : { 'Content-Type': "application/json" }
		})
		$scope.cards.splice($scope.cards.indexOf(card),1)
	}

	$scope.searchFilter = function(card) {
		if ($scope.search.length == 0)
			return true;

		var searchWords = $scope.search.toLowerCase().split(" ");
		var cardTitleWords = card.title.toLowerCase().split(" ");
		var cardTags = card.tags;
		for (var n = 0; n < searchWords.length; n++){
			for (var i = 0; i < cardTitleWords.length; i++){
				if (cardTitleWords[i].toLowerCase().indexOf(searchWords[n].toLowerCase()) != -1){
					return true;
				}
			}
			for (var i = 0; i < cardTags.length; i++){
				if (cardTags[i].toLowerCase().indexOf(searchWords[n].toLowerCase()) != -1){
					return true;
				}
			}
		}
		return false;
	};

	$http({
		method: 'GET',
		url: '/db'
	}).success(function(response){
		console.log(response)
		$scope.cards = response.cards

	})

});
