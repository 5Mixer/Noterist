app.controller("improve", function($scope,$http,$stateParams,header,database) {
	$scope.cards = []
	$scope.presentedCards = []

	var graphKeys = []
	var graphValues = []

	for (var i = 0; i < 7; i++){
		graphKeys.push(moment().add(-7+i, 'days'))
		graphValues.push(Math.round(Math.random()*((2*i)+10) *100)/100)
	}

	var ctx = document.getElementById("improveGraph").getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: graphKeys,
			datasets: [{
				label: 'Improvement score',
				data: graphValues,
				backgroundColor:'rgba(255, 99, 99, 0.3)',
				borderColor:'rgba(255, 99, 99, 1)',
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				xAxes: [{
					type: "time",
					distribution: "linear",
					time: {
						unit: 'day',
						tooltipFormat : 'day'
					}

				}]
			}
		}
	});

	var improveMessages = [
		"Constant revision is critical, keep going!",
		"Excellent revision, this is your top week!",
		"You can do it!",
		"Revision is key. Keep it up!"
	]
	$scope.improveMessage = improveMessages[Math.floor(Math.random()*improveMessages.length)]

	$scope.flagStrong = function card(card){
		card.stats.flags.strength++
		saveCard(card)
	}
	$scope.flagWeak = function card(card){
		card.stats.flags.weakness++
		saveCard(card)
	}
	$scope.flagImportant = function card(card){
		card.stats.flags.important ++
		saveCard(card)
	}

	function saveCard(card){
		$http({
			method: "PATCH",
			url : "/cards",
			data: card,
			headers : { 'Content-Type': "application/json" }
		})
	}

	database.get().then(function(db){
		$scope.cards = db.notes.cards
		var numberOfPresentedCards = 6;
		var sortedCards = _.sortBy(db.cards,function (card){
			// The magic function that calculated how much something should be shown.
			// Higher means it should be presented more.
			var otherFactors = 0

			// Has this card been shown very infrequently / not at all? Bump it's probability
			// In reality, this should be == 0, because eventually that will rule all the cards out.
			// Instead, it shown be the card with the fewest interactions.
			var totalCardInteractions = card.stats.flags.weakness + card.stats.flags.strength + card.stats.flags.important
			if (totalCardInteractions == 0){
				otherFactors +=2; //If there have been no interactions, bump chance.
			}

			var randomness = 1;
			var value = (card.stats.flags.weakness * 1.5)
			+ card.stats.flags.important
			- card.stats.flags.strength
			- (card.stats.presented * .5)
			- (totalCardInteractions *.3) //Deprioritise cards with heaps of interactions.
			+ otherFactors
			-(randomness * .5)+ (Math.random()*randomness)

			console.log(Math.round(value*10)/10+" "+card.title)
			return -value;
		})
		$scope.presentedCards = _.take(sortedCards,numberOfPresentedCards)
		console.log($scope.presentedCards)
		$scope.$apply();
	})
})
