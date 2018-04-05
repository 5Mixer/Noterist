app.controller("glossary", function($scope,$http) {
	$scope.search = ""
	$scope.terms = []

	$scope.terms = [
		{ term: "Enhancer", definition: "A segment of DNA that can be bound to by activator proteins to increase the likelihood that transcription of a gene will occur."},
		{ term: "Operator", definition: " A segment of DNA that a transcription factor binds to in order to block RNA polymerase and thus transcription."},
		{ term: "Endocytosis", definition: "The energy requiring process in which vescicles bring foreign matierlal into a cell."},
		{ term: "Repressor", definition: "The energy requiring process in which vescicles bring foreign matierlal into a cell."},
		{ term: "Exocytosis", definition: " A protein that can inhibit the expression of one or more genes by binding to the operator."}
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
