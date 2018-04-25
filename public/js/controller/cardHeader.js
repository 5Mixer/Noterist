app.controller("cardHeader", function ($scope, header){
	$scope.header = header
	$scope.openNewCard = function (){
		header.openNewCard()
	}
})
