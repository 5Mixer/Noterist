app.service('database',function($http){
	var database = undefined

	this.getCards = function () {
		return new Promise(function(resolve, reject) {
			$http({
				method: 'GET',
				url: '/cards/'
			}).then(function (response){
				resolve (response.data)
			}, function (response){
				console.log("error GETing cards")
			})
		})
	}
	this.getStudysheets = function () {
		return new Promise(function(resolve, reject) {
			$http({
				method: 'GET',
				url: '/studysheets'
			}).then(function (response){
				resolve (response.data)
			})
		})
	}
	/*this.get = function (){
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
	}*/
});
