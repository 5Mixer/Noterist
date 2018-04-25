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
									important: 0,
									understood: 0
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
