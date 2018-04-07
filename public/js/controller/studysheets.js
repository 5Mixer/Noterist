

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


app.controller("studysheets", function($scope,$http) {
	$scope.search = ""

	$scope.hierarchy = [];

	$scope.studydoc = undefined
	$scope.activeNode = undefined;

	// A node has been clicked, open it, showing images etc. (Don't 'expand')
	$scope.open = function (node,scope){
		saveSheet(); //Save whatever was open before hand so that changes aren't lost.
		$scope.activeNode = node;
		if (node.documentid != undefined){
			var studysheet = undefined
			for (var i = 0; i < $scope.studysheets.length; i++){
				if ($scope.studysheets[i].id == node.documentid){
					console.log("Found study sheet, opening.")
					$scope.studydoc = $scope.studysheets[i]
					return; //Break once the study sheet is found.
				}
			}
			console.log("Odd behaviour! Study sheet node *with* ID had no matching studysheet! Doc id: "+node.documentid)
		}

		//If this point is reached, a node has been opened with no corresponding document. Make one.
		console.log("Creating new study sheet.")
		var studysheetId = node.documentid || ""+Math.random()*9999999999;
		var newStudysheet = {
			"title": node.title || "New studysheet",
			"tags":[],
			"id":studysheetId,
			"pages": []
		}
		node.documentid = studysheetId;
		$scope.studysheets.push(newStudysheet)
		$scope.studydoc = newStudysheet
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

	var lastSave = undefined;
	saveSheet = function(){
		if ($scope.studydoc == undefined)
			return;
		if (JSON.stringify($scope.studydoc) == lastSave)
			return; //No neat to send off something that the server already has a copy of...

		lastSave = JSON.stringify($scope.studydoc); //Deep save, otherwise they will be assigned to same instance

		console.log("...saving sheet...")

		$http({
			method: "PATCH",
			url : "/studysheets",
			data: $scope.studydoc,
			headers : { 'Content-Type': "application/json" }
		})
	}

	setInterval(saveSheet, 2000) //Periodically check if anything has changed from last save, and if so, save it.

	hierarchyModified = function (){
		$http({
			method: "PATCH",
			url : "/hierarchy",
			data: $scope.hierarchy,
			headers : { 'Content-Type': "application/json" }
		})
		console.log("Sending server hierarchy update")
	}

	$scope.remove = function (scope) {
		scope.remove();
	};

	$scope.toggle = function (scope) {
		scope.toggle();
	};

	$scope.newSubItem = function (scope) {
		var nodeData = scope.$modelValue;
		nodeData.nodes.push({
			id: ""+Math.random()*9999999999,
			title: nodeData.title + '.' + (nodeData.nodes.length + 1),
			documentid: undefined, //No assosiated document yet. When opened, a doc will be created.
			nodes: []
		});
	};

	$scope.collapseAll = function () {
		$scope.$broadcast('angular-ui-tree:collapse-all');
	};

	$scope.expandAll = function () {
		$scope.$broadcast('angular-ui-tree:expand-all');
	};

	// For the hierarchy, it is easier to watch for any changes than try and predict when they happen
	// Many things can cause a hierarchy change, adding, deleting, dragging, renaming...
	// The third arguement specifies that the hierarchy should be watched deeply.
	$scope.$watch("hierarchy",hierarchyModified, true)

	$scope.studysheets = []
	$http({
		method: 'GET',
		url: '/db'
	}).success(function(response){
		$scope.studysheets = response.studysheets
		$scope.hierarchy = response.hierarchy
		console.log($scope.hierarchy)
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
