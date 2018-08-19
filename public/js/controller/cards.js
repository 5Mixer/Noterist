function Card(){
	this.title = "";
	this.tags = ""
	this.file = undefined;
	this.stats = {
		flags: {
			strength: 0,
			weakness: 0,
			important: 0,
		},
		presented: 0
	}
	return this;
}
app.controller("cards", function($scope,$http,$stateParams,header,database) {
	$scope.cards = []
	//Load any search from the url.
	setTimeout(function(){
		$scope.$watch(function(){return $scope.filteredCards.length},function (a){
			header.filteredCards = a
			header.totalCards = $scope.cards.length
		})
		header.search = $stateParams.search
		$scope.$apply()
	},0)


	header.openNewCard = function () {
		$scope.newCardDialogOpen = !$scope.newCardDialogOpen
	}

	database.getCards().then(function(cards){
		console.log("Got cards")
		$scope.cards = cards
		console.log($scope.cards)
		$scope.$apply();
	},function (err){
		console.log(err)
	})

	$scope.newcard = new Card()
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
		if (header.search == undefined)
			return true;
		if (header.search.length == 0)
			return true;

		var searchWords = header.search.toLowerCase().split(" ");
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
			if (searchWords[n][0] == "#" && searchWords[n].length > 1){
				var id = header.search.split(" ")[n].slice(1) //Not that no case function is called, H/h is kept as in search
				if (card.id.indexOf(id) == 0){
					return true;
				}
			}
		}
		return false;
	};
})
