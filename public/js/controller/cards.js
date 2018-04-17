app.controller("cards", function($scope,$http,$stateParams,header,database) {

	$scope.search = header.getSearch
	console.log($stateParams)
		header.setSearch(""+($stateParams.search))

	header.openNewCard = function () {
		$scope.newCardDialogOpen = !$scope.newCardDialogOpen
	}

	$scope.cards = []
	database.get().then(function(db){
		console.log(db)
		$scope.cards = db.cards
		console.log($scope.cards)
		$scope.$apply();
	})

	$scope.newcard = {title:"",tags:"",file:undefined}
	$scope.newCardDialogOpen = false;

	$scope.newCard = function () {
		$http({
			method  : 'POST',
			url     : '/cards',
			data    : $scope.newcard,
			headers : { 'Content-Type': "application/json" }  // set the headers so angular passing info as form data (not request payload)
		}).then(function (response){
			$scope.cards.push(response.data)
		})
		$scope.newCardDialogOpen = false;
		$scope.newcard = {title:"",tags:"",file:undefined}
	}
	$scope.cancelCard = function () {
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
		if ($scope.search().length == 0)
			return true;

		var searchWords = $scope.search().toLowerCase().split(" ");
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
})
