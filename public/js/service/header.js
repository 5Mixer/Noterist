app.factory('header',function(){
	search = ""
	var headerData = {
		search: search,
		getSearch:
			function (){
				return search || ""
			},
		setSearch:
			function(s){
				search = s
			}
		}
	return headerData;
});
