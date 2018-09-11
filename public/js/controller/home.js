app.controller("home", function($scope,$http,$state,header,database,Account) {
	$scope.databaseItems = []
	$scope.user = Account.getAccount()
	$scope.quotes = [
		{
			quote : "Start where you are. Use what you have. Do what you can. ",
			author : "Arthur Ashe"
		},
		{
			quote : "The secret of success is to do the common things uncommonly well. ",
			author : "John D. Rockefeller"
		},
		{
			quote : "Success is the sum of small efforts, repeated day in and day out.",
			author : "Robert Collier"
		},
		{
			quote : "Don’t wish it were easier; wish you were better. ",
			author : "Jim Rohn"
		},
		{
			quote : "There is no substitute for hard work. ",
			author : "Thomas Edison"
		},
		{
			quote : "If you’re going through hell, keep going. ",
			author : "Winston Churchill"
		},
		{
			quote : "You don’t drown by falling in the water; you drown by staying there. ",
			author : "Ed Cole"
		},
		{
			quote : "Motivation is what gets you started. Habit is what keeps you going.",
			author : "Jim Ryun"
		},
		{
			quote : "Even if you’re on the right track, you’ll get run over if you just sit there.",
			author : "Will Rogers"
		},
		{
			quote : "Do not wait to strike till the iron is hot; but make it hot by striking.",
			author : "William Butler Yeats"
		},
		{
			quote : "The purpose of learning is growth, and our minds, unlike our bodies, can continue growing as long as we live.",
			author : "Mortimer Adler"
		}
	]
	$scope.quoteIndex = Math.floor(Math.random()*$scope.quotes.length)
	database.getCards().then(function(cards){
		$scope.databaseItems = cards;
		// $scope.user = db.user
		$scope.$apply()
	})
	$scope.search = ""

	$scope.logout = function () {
		Account.logout()
	}

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
