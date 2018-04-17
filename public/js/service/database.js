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
					console.log(database)
					resolve(database)
				})
			}
		});
	}
});
