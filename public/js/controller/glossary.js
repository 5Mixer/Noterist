function GlossaryTerm(){
	this.term = "";
	this.definition = ""
	this.beingEdited = false;
	return this;
}
app.controller("glossary", function($scope,$http,database) {
	$scope.search = ""
	$scope.terms = []

	$scope.newcard = new GlossaryTerm()
	$scope.newCardDialogOpen = false;

	$scope.newTerm = function () {
		$http({
			method  : 'POST',
			url     : '/glossary',
			data    : $scope.newterm,
			headers : { 'Content-Type': "application/json" }  // set the headers so angular passing info as form data (not request payload)
		}).then(function (response){
			$scope.terms.push(response.data)
		})
		$scope.newCardDialogOpen = false;
		$scope.newterm = {term:"",definition:""}
	}
	$scope.cancelTerm = function () {
		$scope.newCardDialogOpen = false;
		$scope.newterm = {term:"",definition:""}
	}
	$scope.delete = function(term){
		$http({
			method: "DELETE",
			url : "/glossary",
			data: term,
			headers : { 'Content-Type': "application/json" }
		}).then(function(response){
			$scope.terms.splice($scope.terms.indexOf(term),1)
		})
	}

	$scope.terms = []
	database.get().then(function(db){
		$scope.terms = db.notes.glossary
		$scope.$apply();
	})

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
