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
	$scope.newCardDialogOpen = false;

	$scope.openNewCard = function () {
		$scope.newCardDialogOpen = !$scope.newCardDialogOpen
	}

	$scope.newCard = function () {
		$http({
			method  : 'POST',
			url     : '/cards',
			data    : $scope.newcard,
			headers : { 'Content-Type': "application/json" }  // set the headers so angular passing info as form data (not request payload)
		}).success(function (response){
			$scope.cards.push(response)
		})
		$scope.newCardDialogOpen = false;
		$scope.newcard = {title:"",tags:"",file:undefined}
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

	$scope.edit = function (card){
		card.beingEdited = true;
		card.edits = {title: card.title, tags: card.tags.join(" "), description: card.description }
	}
	$scope.saveEdits = function (card){
		card.beingEdited = false;
		card.title = card.edits.title;
		card.tags = card.edits.tags.split(" ")
		card.description = card.edits.description
		card.edits = undefined;
		$http({
			method: "PATCH",
			url : "/cards",
			data: card,
			headers : { 'Content-Type': "application/json" }
		})
	}
	$scope.cancelEdits = function (card){
		card.beingEdited = false;
		card.edits = undefined;
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
