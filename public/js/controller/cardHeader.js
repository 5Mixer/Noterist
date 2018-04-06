app.controller("cardHeader", function ($scope, header){
	$scope.$watch("search",function (a){
		header.setSearch(a)
	})
	$scope.openNewCard = function (){
		header.openNewCard()
	}
})
