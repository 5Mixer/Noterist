app.service('database',function($http){
	var database = undefined
	this.get = function (){
		return new Promise(function(resolve, reject) {
			console.log(database)
			if (database != {} && database != undefined){
				resolve(database)
			}else{
				$http({
					method: 'GET',
					url: '/db'
				}).then(function(response){
					database = response.data
					resolve(response.data)
				})
			}
		});
	}
});
