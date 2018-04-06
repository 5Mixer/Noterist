app.controller("studysheets", function($scope,$http) {
	$scope.search = ""

	$scope.studysheets = [
		{
			title: "Signalling molecules",
			tags: ["signalling", "endocrine","paracrine", "autocrine", "hormones", "neurotransmitters", "cytokines", "pheromones", "neurohormones", "MHC", "growth regulators"],
			pages: [
				{
					img: "Signalling molecules.jpg"
				},
				{
					img: "Signalling molecules 2.jpg"
				}
			]
		}
	]

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
})
