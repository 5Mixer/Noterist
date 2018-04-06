

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
