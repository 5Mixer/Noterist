

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

	database.getStudysheets().then(function(studysheetData){
		$scope.studysheets = studysheetData.studysheets
		$scope.hierarchy = studysheetData.hierarchy
		$scope.$apply();
	})

})
