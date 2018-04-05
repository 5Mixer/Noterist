var app = angular.module("studycloud", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	// .state('root', {
	//     abstract: true,  //no url, this is just so that other properties have defaults.
	//     views:{
	//         'header': {
	//             template: '',
	//             controller: function($scope){}
	//         },
	//         'content': {
	//             template: '',
	//             controller: function($scope){}
	//         }
	//     }
	// })
	.state("home", {
		url: "/",
		views: { 'content' : { templateUrl : "templates/home.html", controller: "core" } },

	})
	.state("test", {
		url: "/test",
		views: { 'content' : { templateUrl : "templates/test.html" } }
	})
	.state("glossary", {
		url: "/glossary",
		views: { 'content' : { templateUrl : "templates/glossary.html",controller: "glossary" } },

	})
	.state("cards", {
		url: "/cards",
		views: {
			'header' : { templateUrl: "templates/cardHeader.html", controller: "cardHeader"},
			'content': { templateUrl : "templates/cards.html", controller: "cards"}
		}
	})
	.state("studysheets", {
		url: "/studysheets",
		views: { 'content' : { templateUrl : "templates/studysheets.html" } }
	})
	.state("sacs", {
		url: "/sacs",
		views: { 'content' : { templateUrl : "templates/SACs.html", controller: "core" } },
	})
	.state("listen", {
		url: "/listen",
		views: { 'content' : { templateUrl : "templates/listen.html" } }
	})
	$urlRouterProvider.otherwise('/');
});

app.run(function($rootScope) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        // handle route changes
        console.log("Eoute change "+current)
    });
});

// Helper directive for uploading files as base64 equivalents.
app.directive("fileread", [function () {
	return {
		scope: {
			fileread: "="
		},
		link: function (scope, element, attributes) {
			element.bind("change", function (changeEvent) {
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					console.log(loadEvent.target.result)
					scope.$apply(function () {
						scope.fileread = loadEvent.target.result;
					});
				}
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
	}
}]);
