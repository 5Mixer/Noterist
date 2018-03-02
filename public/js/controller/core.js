app.controller("core", function($scope) {
	$scope.search = ""

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

	$scope.cards = [
		{ img: "dna rna polymerase.jpg", title: "DNA RNA Polymerase Differences", tags:["DNA","RNA","polymerase","comparison","differences","replication","transcription"] },
		{ img: "photosynthesis io.jpg", title: "Photosynthesis inputs and outputs", tags:["process","input","output"] },
		{ img: "polymerisation.jpg", title: "Polymerisation", tags:["chemistry"] },
		{ img: "protein structure.jpg", title: "Four levels of protein structure", tags:["protein","structure"] },
		{ img: "enzyme substrate fit.jpg", title: "Lock and key versus induced fit model", tags:["lock","key","induced fit"] },
		{ img: "endocytosis exocytosis.jpg", title: "Endocytosis versus exocytosis", tags:["export","import","exocytosis","endocytosis","pinocytosis","phagocytosis"] },
		{ img: "coenzymes.jpg", title: "Coenzymes as energy carriers", tags:["WIP","coenzyme","ATP","NADPH","NADPH+","ADP"] }
	]
});
