

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

	$scope.studydoc = undefined

	// A node has been clicked, open it, showing images etc. (Don't 'expand')
	$scope.open = function (node){
		console.log(node)
		if (node.documentid != undefined){
			var studysheet = undefined
			for (var i = 0; i < $scope.studysheets.length; i++){
				if ($scope.studysheets[i].id == node.documentid){
					console.log("Found study sheet, opening.")
					$scope.studydoc = $scope.studysheets[i]
					return; //Break once the study sheet is found.
				}
			}
			console.log("Odd behaviour! Study sheet node *with* ID had no matching studysheet!")
		}
		//If this point is reached, a node has been opened with no corresponding document. Make one.
		console.log("Creating new study sheet.")
		var studysheetId = ""+Math.random()*999999999;
		var newStudysheet = {
			"title": node.title || "New studysheet",
			"tags":[],
			"id":studysheetId,
			"pages": []
		}
		node.documentid = studysheetId;
		$scope.studysheets.push(newStudysheet)
		$scope.studydoc = newStudysheet
	}

	$scope.appendTextPage = function (sheet) {
		var page = {
			"type": "text"
		}
		sheet.pages.push(page)
	}
	$scope.appendImagePage = function (sheet) {
		var page = {
			"type": "image"
		}
		sheet.pages.push(page)
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
			id: nodeData.id * 10 + nodeData.nodes.length,
			title: nodeData.title + '.' + (nodeData.nodes.length + 1),
			nodes: []
		});
	};

	$scope.collapseAll = function () {
		$scope.$broadcast('angular-ui-tree:collapse-all');
	};

	$scope.expandAll = function () {
		$scope.$broadcast('angular-ui-tree:expand-all');
	};

	$scope.data = [{
		'id': "1",
		'title': 'AOS 1',
		'nodes': [
			{
				'id': "11",
				'title': 'Cell membrane',
				'nodes': [
					{
						'id': "111",
						'title': 'Diagram',
						'nodes': []
					}
				]
			},
			{
				'id': "12",
				'title': 'Organelles',
				'nodes': []
			}
		]
	}, {
		'id': "2",
		'title': 'AOS 2',
		'nodes': [
		{
			'id': "21",
			'title': 'Cell signalling',
			'documentid': 'AN7gK2TRsmL',
			'nodes': []
		},
		{
			'id': "22",
			'title': 'Cell defence',
			'nodes': []
		}
		]
	}];


	$scope.studysheets = []
	$http({
		method: 'GET',
		url: '/db'
	}).success(function(response){
		console.log(response)
		$scope.studysheets = response.studysheets
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
