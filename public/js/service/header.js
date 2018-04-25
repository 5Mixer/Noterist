// Ah this file makes me cry. A complete hack to get the card header view talking to the card content view
app.factory('header',function(){
	this.search = ""
	this.filteredCards = 0
	this.totalCards = 0
	return this;
});
