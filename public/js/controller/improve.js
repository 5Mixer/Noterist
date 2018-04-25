app.controller("improve", function($scope,$http,$stateParams,header,database) {
	$scope.cards = []
	$scope.presentedCards = []
	database.get().then(function(db){
		$scope.cards = db.cards
		var numberOfPresentedCards = 6;
		var sortedCards = _.sortBy(db.cards,function (card){
			// The magic function that calculated how much something should be shown.
			// Higher means it should be presented more.
			var randomness = 1;
			var value = card.stats.flags.weakness * 1.5
			+ card.stats.flags.important
			- card.stats.flags.understood
			- (card.stats.presented * .5)
			-(randomness * .5)+ (Math.random()*randomness)

			console.log(value)
			return value;
		})
		$scope.presentedCards = _.take(sortedCards,numberOfPresentedCards)
		console.log($scope.presentedCards)
		$scope.$apply();
	})
})
