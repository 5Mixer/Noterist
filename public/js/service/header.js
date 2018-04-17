// Ah this file makes me cry. A complete hack to get the card header view talking to the card content view
app.factory('header',function(){
	var headerData = {
		getSearch:
			function (){
				return search || ""
			},
		setSearch:
			function(s){
				search = s
			},
		openNewCard: function () {console.log("Error: This function should have been overriden")}
	}

	return headerData;
});
