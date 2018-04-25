app.controller("home", function($scope,$http,$state,header,database) {
	$scope.databaseItems = {}
	database.get().then(function(db){
		$scope.databaseItems = db;
		$scope.$apply()
	})
	$scope.search = ""

	$scope.openCard = function(card){
		$state.go("cards",{search:"#"+card.id})
	}

	$scope.searchFilter = function(card) {
		if ($scope.search.length == 0)
			return false;

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
});
