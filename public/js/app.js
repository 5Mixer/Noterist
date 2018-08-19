var app = angular.module("studycloud", ["ngQuill", "ui.router","ui.tree", "ngCookies"]);

var icons = {
	"home":"home",
	"test":"lightbulb",
	"glossary":"book",
	"cards":"list-alt",
	"studysheets":"file-alt",
	"improve":"chart-line",
	"listen":"file-video"
}

app.filter('encodeURIComponent', function() {
	return window.encodeURIComponent;
});

app.config(function($stateProvider, $urlRouterProvider,ngQuillConfigProvider, $locationProvider) {
	$locationProvider.hashPrefix(''); //Remove ! in url.
	// $locationProvider.html5Mode(true);

	var colours = [
		"rgb(147, 190, 255)",
		"rgb(247, 236, 95)",
		"rgb(167, 246, 156)",
		"rgb(241, 152, 159)",
		"rgb(209, 173, 255)",
		"rgb(255, 112, 112)",
		"rgb(96, 242, 237)"
	]

	ngQuillConfigProvider.set({
		theme: 'snow',
		modules: {
			toolbar: [
				[{ header: [1, 2, 3, false] }],
				[{ 'font': [] }],
				['bold', 'italic', 'underline'],
				[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
				['link', 'image', 'video'],
				[{ 'background': colours }],          // dropdown with defaults from theme
				[{ 'align': [] }],
				['clean']
			]
		}
	});

	$stateProvider.state('direct',{
		controller: function($scope,$state,Account) {
			if (Account.isLoggedIn()){
				$state.go('home');
			}else{
				$state.go('anon');
			}
		}
	})

	$stateProvider
	.state("anon", {
		views: { 'content' : { templateUrl: "templates/outfacing.html", controller: "outfacing"}},
		data: {
			secure: false
		}
	})
	/*.state("user", {
		abstract: true,
		data: {
			secure: true 
		}
	})*/
	.state("home", {
		url: "/",
		views: { 'content' : { templateUrl : "templates/home.html", controller: "home" } },
		data: {
			secure: true 
		}
	})
	
/*	.state("test", {
		url: "/test",
		views: { 'content' : { templateUrl : "templates/test.html" } }
	})
	.state("glossary", {
		url: "/glossary",
		views: { 'content' : { templateUrl : "templates/glossary.html",controller: "glossary" } },

	})*/
	.state("cards", {
		url: "/cards?search&id",
		views: {
			'header' : { templateUrl: "templates/cardHeader.html", controller: "cardHeader"},
			'content': { templateUrl : "templates/cards.html", controller: "cards"}
		},
		data: {
			secure: true 
		}
	})
	.state("studysheets", {
		url: "/studysheets",
		views: { 'content' : { templateUrl : "templates/studysheets.html", controller: "studysheets" } },
		data: {
			secure: true 
		}
	})
	/*.state("user.improve", {
		url: "/improve",
		views: { 'content' : { templateUrl : "templates/improve.html", controller: "improve" } },
	})/*
	.state("listen", {
		url: "/listen",
		views: { 'content' : { templateUrl : "templates/listen.html" } }
	})*/
	$urlRouterProvider.otherwise('/');
});

app.run(function($rootScope, $state, $stateParams) {
	$rootScope.$on("$locationChangeStart", function(event, next, current) {
		$rootScope.stateIcon = "fa-" + icons[$state.current.name]
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
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
