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
		{ img: "coenzymes.jpg", title: "Coenzymes as energy carriers", tags:["WIP","coenzyme","ATP","NADPH","NADPH+","ADP"] },
		{ img: "1.jpg", title: "DNA Triplet, Codon and Anti-codon", tags:[ "vocabulary", "triplet", "codon", "anti-codon" ] },
		{ img: "2.jpg", title: "Structure of a Eukaryotic gene", tags:[ "vocabulary" ] },
		{ img: "3.jpg", title: "Reaction vocabulary", tags:[ "vocabulary" ] },
		{ img: "4.jpg", title: "Phospholipid", tags:[ "diagram" ] },
		{ img: "5.jpg", title: "Phospholipid bilayer", tags:[ "diagram" ] },
		{ img: "6.jpg", title: "Transport across cell membrane", tags:[ "table", "transport", "ion", "polar" ] },
		{ img: "7.jpg", title: "Secretory pathway", tags:[ "pathway", "protein", "golgi", "ribosome" ] },
		{ img: "8.jpg", title: "Condensation versus hydrolysis", tags:[ "comparison" ] },
		{ img: "9.jpg", title: "Amino acid structure", tags:[ "chemistry", "peptide", "r-group", "carboxyl" ] },
		{ img: "10.jpg", title: "Bonds in protein structure", tags:[ "chemistry", "bonds" ] },
		{ img: "11.jpg", title: "Nucleotide structure", tags:[ "chemistry", "structure" ] },
		{ img: "12.jpg", title: "Permeability of phospholipid bilayer", tags:[ "table", "permeability" ] },
		{ img: "13.jpg", title: "Effect of osmosis on cells", tags:[ "table", "osmosis", "flaccid", "turgid", "burst" ] },
		{ img: "14.jpg", title: "Fibrous versus globular proteins", tags:[ "comparison" ] }
	]
});
