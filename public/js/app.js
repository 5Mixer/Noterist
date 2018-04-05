var app = angular.module("studycloud", ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "templates/home.html",
		controller: "core"
	})
	.when("/test", {
		templateUrl : "templates/test.html"
	})
	.when("/glossary", {
		templateUrl : "templates/glossary.html",
		controller: "glossary"
	})
	.when("/cards", {
		templateUrl : "templates/cards.html",
		controller: "cards"
	})
	.when("/studysheets", {
		templateUrl : "templates/studysheets.html"
	})
	.when("/sacs", {
		templateUrl : "templates/SACs.html",
		controller: "core"
	})
	.when("/listen", {
		templateUrl : "templates/listen.html"
	})
	.when("/home", {redirectTo: '/'})
	.otherwise({ redirectTo: '/'})
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
