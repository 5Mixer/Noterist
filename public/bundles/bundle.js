var app = angular.module("studycloud", ["ngQuill", "ui.router","ui.tree"]);

var icons = {
	"home":"home",
	"test":"lightbulb",
	"glossary":"book",
	"cards":"list-alt",
	"studysheets":"file-alt",
	"improve":"chart-line",
	"listen":"file-video"
}

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

	$stateProvider
	.state("home", {
		url: "/",
		views: { 'content' : { templateUrl : "templates/home.html", controller: "home" } },

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
		url: "/cards?search&id",
		views: {
			'header' : { templateUrl: "templates/cardHeader.html", controller: "cardHeader"},
			'content': { templateUrl : "templates/cards.html", controller: "cards"}
		}
	})
	.state("studysheets", {
		url: "/studysheets",
		views: { 'content' : { templateUrl : "templates/studysheets.html", controller: "studysheets" } }
	})
	.state("improve", {
		url: "/improve",
		views: { 'content' : { templateUrl : "templates/improve.html", controller: "improve" } },
	})
	.state("listen", {
		url: "/listen",
		views: { 'content' : { templateUrl : "templates/listen.html" } }
	})
	$urlRouterProvider.otherwise('/');
});

app.run(function($rootScope, $state, $stateParams) {
	$rootScope.$on("$locationChangeStart", function(event, next, current) {
		// handle route changes
		console.log("State change "+$state.current.name)
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

app.service('database',function($http){
	var database = undefined
	this.get = function (){
		return new Promise(function(resolve, reject) {
			if (database != {} && database != undefined){
				console.log(database)
				resolve(database)
			}else{
				$http({
					method: 'GET',
					url: '/db'
				}).then(function(response){
					database = response.data

					for (var c = 0; c < database.cards.length; c++){
						if (database.cards[c].stats == undefined){
							database.cards[c].stats = {
								flags: {
									strength: 0,
									weakness: 0,
									important: 0
								},
								presented: 0
							}
						}
					}

					console.log(database)
					resolve(database)
				})
			}
		});
	}
});

// Ah this file makes me cry. A complete hack to get the card header view talking to the card content view
app.factory('header',function(){
	this.search = ""
	this.filteredCards = 0
	this.totalCards = 0
	return this;
});

app.controller("core", function($scope,$http,header) {
	$scope.capitalizeFirstLetter = function(string) {
		if (string == undefined)
			return ""
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
});

app.controller("home", function($scope,$http,$state,header,database) {
	$scope.databaseItems = {}
	database.get().then(function(db){
		$scope.databaseItems = db;
		$scope.$apply()
	})
	$scope.search = ""

	$scope.openCard = function(card){
		$state.go("cards",{search:"#"+card.id})
	}

	$scope.searchFilter = function(card) {
		if ($scope.search.length == 0)
			return false;

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
});

app.controller("improve", function($scope,$http,$stateParams,header,database) {
	$scope.cards = []
	$scope.presentedCards = []

	var graphKeys = []
	var graphValues = []

	for (var i = 0; i < 7; i++){
		graphKeys.push(moment().add(-7+i, 'days'))
		graphValues.push(Math.round(Math.random()*((2*i)+10) *100)/100)
	}

	var ctx = document.getElementById("improveGraph").getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: graphKeys,
			datasets: [{
				label: 'Improvement score',
				data: graphValues,
				backgroundColor:'rgba(255, 99, 99, 0.3)',
				borderColor:'rgba(255, 99, 99, 1)',
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				xAxes: [{
					type: "time",
					distribution: "linear",
					time: {
						unit: 'day',
						tooltipFormat : 'day'
					}

				}]
			}
		}
	});

	var improveMessages = [
		"Constant revision is critical, keep going!",
		"Excellent revision, this is your top week!",
		"You can do it!",
		"Revision is key. Keep it up!"
	]
	$scope.improveMessage = improveMessages[Math.floor(Math.random()*improveMessages.length)]

	$scope.flagStrong = function card(card){
		card.stats.flags.strength++
		saveCard(card)
	}
	$scope.flagWeak = function card(card){
		card.stats.flags.weakness++
		saveCard(card)
	}
	$scope.flagImportant = function card(card){
		card.stats.flags.important ++
		saveCard(card)
	}

	function saveCard(card){
		$http({
			method: "PATCH",
			url : "/cards",
			data: card,
			headers : { 'Content-Type': "application/json" }
		})
	}

	database.get().then(function(db){
		$scope.cards = db.cards
		var numberOfPresentedCards = 6;
		var sortedCards = _.sortBy(db.cards,function (card){
			// The magic function that calculated how much something should be shown.
			// Higher means it should be presented more.
			var otherFactors = 0

			// Has this card been shown very infrequently / not at all? Bump it's probability
			// In reality, this should be == 0, because eventually that will rule all the cards out.
			// Instead, it shown be the card with the fewest interactions.
			var totalCardInteractions = card.stats.flags.weakness + card.stats.flags.strength + card.stats.flags.important
			if (totalCardInteractions == 0){
				otherFactors +=2; //If there have been no interactions, bump chance.
			}

			var randomness = 1;
			var value = (card.stats.flags.weakness * 1.5)
			+ card.stats.flags.important
			- card.stats.flags.strength
			- (card.stats.presented * .5)
			- (totalCardInteractions *.3) //Deprioritise cards with heaps of interactions.
			+ otherFactors
			-(randomness * .5)+ (Math.random()*randomness)

			console.log(Math.round(value*10)/10+" "+card.title)
			return -value;
		})
		$scope.presentedCards = _.take(sortedCards,numberOfPresentedCards)
		console.log($scope.presentedCards)
		$scope.$apply();
	})
})



interact('.resize-drag')
	.draggable({
		onmove: dragMoveListener,
		restrict: {
			restriction: 'parent',
			elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
		}
	})
	.resizable({
		// resize from all edges and corners
		edges: { left: true, right: true, bottom: true, top: true },
		// keep the edges inside the parent
		restrictEdges: {
		  outer: 'parent',
		  endOnly: true,
		},

		// minimum size
		restrictSize: {
			min: { width: 80, height: 30 },
		},

		inertia: true,
	}).on('resizemove', function (event) {
		//This is called specifically for RESIZES despite event name.
		var target = event.target,
		x = (parseFloat(target.getAttribute('data-x')) || 0),
		y = (parseFloat(target.getAttribute('data-y')) || 0);

		// update the element's style
		target.style.width  = event.rect.width + 'px';
		target.style.height = event.rect.height + 'px';

		// translate when resizing from top or left edges
		x += event.deltaRect.left;
		y += event.deltaRect.top;

		target.setAttribute("annotationposx",x/parseFloat(window.getComputedStyle(target.nextElementSibling).width))
		target.setAttribute("annotationposy",y/parseFloat(window.getComputedStyle(target.nextElementSibling).height))
		target.setAttribute("annotationwidth",parseFloat(target.style.width)/parseFloat(window.getComputedStyle(target.nextElementSibling).width))
		target.setAttribute("annotationheight",parseFloat(target.style.height)/parseFloat(window.getComputedStyle(target.nextElementSibling).height))


		target.style.webkitTransform = target.style.transform =
		'translate(' + x + 'px,' + y + 'px)';

		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
	});

function dragMoveListener(event) {
	var target = event.target
	x = parseFloat(target.getAttribute('data-x') || 0) + event.dx
	y = parseFloat(target.getAttribute('data-y') || 0) + event.dy

	target.setAttribute("annotationposx",x/parseFloat(window.getComputedStyle(target.nextElementSibling).width))
	target.setAttribute("annotationposy",y/parseFloat(window.getComputedStyle(target.nextElementSibling).height))
	target.setAttribute("annotationwidth",parseFloat(target.style.width)/parseFloat(window.getComputedStyle(target.nextElementSibling).width))
	target.setAttribute("annotationheight",parseFloat(target.style.height)/parseFloat(window.getComputedStyle(target.nextElementSibling).height))

	target.style.webkitTransform = target.style.transform =
		'translate(' + x + 'px,' + y + 'px)';

	target.setAttribute('data-x', x+"");
	target.setAttribute('data-y', y+"");
}


app.controller("studysheets", function($scope,$http,database) {
	$scope.search = ""

	$scope.hierarchy = [];

	$scope.studydoc = undefined
	$scope.activeNode = undefined;

	$scope.quillEditorCreated = function(editor,studysheetpage){
		if (studysheetpage.qtext != undefined){
			var fullEditorDelta = editor.setContents(studysheetpage.qtext)
		}else{
			var fullEditorDelta = editor.getContents()
			studysheetpage.qtext = fullEditorDelta
		}
	}
	$scope.quillContentChange = function(editor, html, text, delta, oldDelta, source, studysheetpage){
		var fullEditorDelta = editor.getContents()
		studysheetpage.qtext = fullEditorDelta

		$scope.studydoc.saveStatus = "Saving..."
	}

	move = function(array, element, delta) {
		var index = array.indexOf(element);
		var newIndex = index + delta;
		if (newIndex < 0  || newIndex == array.length) return; //Already at the top or bottom.
		var indexes = [index, newIndex].sort(); //Sort the indixes
		array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
	};
	$scope.moveUp = function(studySheetPage){
		move($scope.studydoc.pages,studySheetPage,-1)
		saveSheet()
	}
	$scope.moveDown = function(studySheetPage){
		move($scope.studydoc.pages,studySheetPage,1)
		saveSheet()
	}
	$scope.removePage = function(studySheetPage){
		if ($scope.studydoc.pages.indexOf(studySheetPage) != -1){
			$scope.studydoc.pages.splice($scope.studydoc.pages.indexOf(studySheetPage),1)
			saveSheet()
		}
	}

	// A node has been clicked, open it, showing images etc. (Don't 'expand')
	$scope.open = function (node,scope){
		saveSheet(); //Save whatever was open before hand so that changes aren't lost.
		$scope.activeNode = node;
		$scope.editingDoc = false;
		if (node.documentid != undefined){
			var studysheet = undefined
			for (var i = 0; i < $scope.studysheets.length; i++){
				if ($scope.studysheets[i].id == node.documentid){
					console.log("Found study sheet, opening.")
					$scope.studydoc = $scope.studysheets[i]
					$scope.lastSave = JSON.stringify($scope.studydoc)
					return; //Break once the study sheet is found.
				}
			}
			console.log("Odd behaviour! Study sheet node *with* ID had no matching studysheet! Doc id: "+node.documentid)
		}

		//If this point is reached, a node has been opened with no corresponding document. Make one.
		console.log("Creating new study sheet.")
		var studysheetId = node.documentid || id();
		var newStudysheet = {
			"title": node.title || "New studysheet",
			"tags":[],
			"id":studysheetId,
			"pages": []
		}
		node.documentid = studysheetId;
		$scope.studysheets.push(newStudysheet)
		$scope.studydoc = newStudysheet
		$scope.lastSave = JSON.stringify($scope.studydoc) //So that the interval save mechanism doesn't trigger every time studydoc changed.

		// With the new (opened) document, go into edit mode and select the input for changing the title.
		// Is this hacky? Yes. Does it work fine? Yes.
		// The correct angular way of doing this involves setting up a directive, and is complete overkill.
		$scope.editingDoc = true;
		//setTimeout used with 0 delay so that the selection is added to the end of the event que, when the input has loaded.
		setTimeout(function () {
			document.getElementById("editDocTitleInput").select();
		}, 0);

		$http({
			method: "POST",
			url : "/studysheets",
			data: newStudysheet,
			headers : { 'Content-Type': "application/json" }
		})
	}

	$scope.appendTextPage = function (sheet) {
		var page = {
			"type" : "text",
			"text" : ""
		}
		sheet.pages.push(page)
		$http({
			method: "PATCH",
			url : "/studysheets",
			data: sheet,
			headers : { 'Content-Type': "application/json" }
		})
	}
	$scope.appendImagePage = function (sheet) {
		var page = {
			"type": "image"
		}
		sheet.pages.push(page)
		$http({
			method: "PATCH",
			url : "/studysheets",
			data: sheet,
			headers : { 'Content-Type': "application/json" }
		})
	}

	$scope.lastSave = undefined;
	saveSheet = function(){
		if ($scope.studydoc == undefined)
			return;

		if (JSON.stringify($scope.studydoc) == $scope.lastSave)
			return; //No neat to send off something that the server already has a copy of...

		$scope.lastSave = JSON.stringify($scope.studydoc); //Deep save, otherwise they will be assigned to same instance
		var toBeSaved = JSON.parse($scope.lastSave)
		for (var i = 0; i < toBeSaved.pages.length; i++){
			toBeSaved.pages[i].text = undefined
			delete toBeSaved.pages[i].text
			delete toBeSaved.saveStatus
		}
		console.log("...saving sheet...")

		$scope.studydoc.saveStatus = "Saved."

		$http({
			method: "PATCH",
			url : "/studysheets",
			data: toBeSaved,
			headers : { 'Content-Type': "application/json" }
		})
	}

	setInterval(saveSheet, 1000) //Periodically check if anything has changed from last save, and if so, save it.

	hierarchyModified = function (){
		$http({
			method: "PATCH",
			url : "/hierarchy",
			data: $scope.hierarchy,
			headers : { 'Content-Type': "application/json" }
		})
		console.log("Sending server hierarchy update")
	}

	// For the hierarchy, it is easier to watch for any changes than try and predict when they happen
	// Many things can cause a hierarchy change, adding, deleting, dragging, renaming...
	// The third arguement specifies that the hierarchy should be watched deeply.
	$scope.$watch("hierarchy",hierarchyModified, true)

	//Edit the title/tags of the document.
	$scope.editingDoc = false;
	$scope.editdoc = function (){
		$scope.editingDoc = !$scope.editingDoc;
		if (!$scope.editingDoc)
			$scope.activeNode.title = $scope.studydoc.title;
	}
	$scope.$watch("studydoc.title",function(title){
		// if ($scope.activeNode != undefined)
		// 	$scope.activeNode.title = title;
	})

	// naming functions dealing with nests be like
	function flattenChildren(node){
		var nodes = []
		nodes.push(node)
		if (node.nodes == undefined)
			return nodes;
		if (node.nodes.length > 0){
			for (var i = 0; i < node.nodes.length; i++){
				var childNodeChildren = flattenChildren(node.nodes[i])
				for (var n = 0; n < childNodeChildren.length; n++){
					nodes.push(childNodeChildren[n])
				}
			}
		}

		return nodes;
	}

	$scope.treeOptions = {
		// removed: function(node) {
		// }
	};

	$scope.removeNodeAndDoc = function (node){
		//This function is only confusing because the ui tree stores things differently to the apps datastructure.
		//Essentailly, $scope.activeNode only contains OUR object, where as node contains ui tree stuff,
		//so $modelValue must be accessed, where our object is stored. node.$parent.$parent contains the deleted nodes parent.
		//If confused, log everything and read through the objects.

		//Removal in the hierarchy will cause a hierarchy PATCH
		//However the document associated with it needs a DELETE
		console.log("Deleting sheet "+node.$modelValue.id+" from the server.")

		// $http({
		// 	method: "DELETE",
		// 	url : "/studysheets",
		// 	data: {id:node.id},
		// 	headers : { 'Content-Type': "application/json" }
		// })
		//AND ALL THAT NODES CHILDREN AHHH
		var childNodes = flattenChildren(node.$modelValue)
		var sheets = []
		for (var i = 0; i < childNodes.length; i++){
			sheets.push(childNodes[i].documentid)
		}
		console.log("Deleting child sheet/s ("+childNodes.length+") from the server.")
		console.log(sheets);
		$http({
			method: "DELETE",
			url : "/studysheets",
			data: {sheets:sheets},
			headers : { 'Content-Type': "application/json" }
		})

		//If the node's sheet was active/open, we should open something else.
		if ($scope.activeNode == undefined)
			return;
		if ($scope.activeNode.id == node.$modelValue.id){
			console.log("Deleted node was active document")
			if (node.$parent.$parent != undefined){
				console.log("Opening parent "+node.$parent.$parent.node.title)
				//Open parent in hierarchy
				$scope.activeNode = node.$parent.$parent.node
				for (var i = 0; i < $scope.studysheets.length; i++){
					if ($scope.studysheets[i].id == $scope.activeNode.documentid){
						//Open found parent document.
						$scope.studydoc = $scope.studysheets[i]
						$scope.lastSave = JSON.stringify($scope.studyDoc)
					}
				}
			}

		}
	}

	//Move to server?
	function id(){
		var id = "";
		var valid = "abdefghjklmnopqrtuvwkyzABDEFGHJKLMNOPQRTUVWXYZ1234567890" //56 long
		var buf = new Uint8Array(10);
		window.crypto.getRandomValues(buf);
		for (var i = 0; i < buf.length; i++){
			id += valid[Math.floor(buf[i]/255*56)]
		}
		return id;
	}

	$scope.newSubItem = function (scope) {
		var nodeData = scope.$modelValue;
		var newNode = {
			id: ""+id(),
			title: nodeData.title + '.' + (nodeData.nodes.length + 1),
			documentid: undefined, //No assosiated document yet. When opened, a doc will be created.
			nodes: []
		}
		nodeData.nodes.push(newNode);
		//Switch to the created item.
		$scope.open(newNode,scope)
	};

	$scope.collapseAll = function () {
		$scope.$broadcast('angular-ui-tree:collapse-all');
	};

	$scope.expandAll = function () {
		$scope.$broadcast('angular-ui-tree:expand-all');
	};

	$scope.studysheets = []

	database.get().then(function(db){
		$scope.studysheets = db.studysheets
		$scope.hierarchy = db.hierarchy
		$scope.$apply();
	})

})

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
		$scope.terms = db.glossary
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

app.controller("cardHeader", function ($scope, header){
	$scope.header = header
	$scope.openNewCard = function (){
		header.openNewCard()
	}
})

function Card(){
	this.title = "";
	this.tags = ""
	this.file = undefined;
	this.stats = {
		flags: {
			strength: 0,
			weakness: 0,
			important: 0,
		},
		presented: 0
	}
	return this;
}
app.controller("cards", function($scope,$http,$stateParams,header,database) {
	$scope.cards = []

	//Load any search from the url.
	setTimeout(function(){
		$scope.$watch(function(){return $scope.filteredCards.length},function (a){
			header.filteredCards = a
			header.totalCards = $scope.cards.length
		})
		header.search = $stateParams.search
		$scope.$apply()
	},0)


	header.openNewCard = function () {
		$scope.newCardDialogOpen = !$scope.newCardDialogOpen
	}

	database.get().then(function(db){
		$scope.cards = db.cards
		$scope.$apply();
	})

	$scope.newcard = new Card()
	$scope.newCardDialogOpen = false;

	$scope.newCard = function () {
		$http({
			method  : 'POST',
			url     : '/cards',
			data    : $scope.newcard,
			headers : { 'Content-Type': "application/json" }  // set the headers so angular passing info as form data (not request payload)
		}).then(function (response){
			$scope.cards.push(response.data)
		})
		$scope.newCardDialogOpen = false;
		$scope.newcard = {title:"",tags:"",file:undefined}
	}
	$scope.cancelCard = function () {
		$scope.newCardDialogOpen = false;
		$scope.newcard = {title:"",tags:"",file:undefined}
	}

	$scope.delete = function(card){
		$http({
			method: "DELETE",
			url : "/cards",
			data: card,
			headers : { 'Content-Type': "application/json" }
		})
		$scope.cards.splice($scope.cards.indexOf(card),1)
	}

	$scope.edit = function (card){
		card.beingEdited = true;
		card.edits = {title: card.title, tags: card.tags.join(" "), description: card.description }
	}
	$scope.saveEdits = function (card){
		card.beingEdited = false;
		card.title = card.edits.title;
		card.tags = card.edits.tags.split(" ")
		card.description = card.edits.description
		card.edits = undefined;
		$http({
			method: "PATCH",
			url : "/cards",
			data: card,
			headers : { 'Content-Type': "application/json" }
		})
	}
	$scope.cancelEdits = function (card){
		card.beingEdited = false;
		card.edits = undefined;
	}

	$scope.searchFilter = function(card) {
		if (header.search == undefined)
			return true;
		if (header.search.length == 0)
			return true;

		var searchWords = header.search.toLowerCase().split(" ");
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
			if (searchWords[n][0] == "#" && searchWords[n].length > 1){
				var id = header.search.split(" ")[n].slice(1) //Not that no case function is called, H/h is kept as in search
				if (card.id.indexOf(id) == 0){
					return true;
				}
			}
		}
		return false;
	};
})
