app.factory('Account', function($state,$http, $rootScope, $cookies) {

    //This function doesn't rely on (potentially old) cookies, it just asks the server
    //if this session is currently authorised, allowing for cases such as the server
    //being restarted (and thus lost sessions)
    function isLoggedInCheck (){
		// NOTE: NOT CURRENTLY USED, SO ABOVE PROBLEM EXISTS.
        $http.get('/user').then(function(response){
            var data = response.data;
            return data.secure;
        })
    }

    var cookieExpireDate = new Date();
    cookieExpireDate.setDate(cookieExpireDate.getDate() + 1);

	function getAccount (){
		if ($cookies.getObject('user') != undefined){
			return $cookies.getObject('user')
		}else{
			return { email: '', secure: false };
		}
	}

    return {
        getAccount: getAccount,

        isLoggedIn : function (){
			return getAccount ().secure;
        },
        logout: function(success, error) {
            $cookies.remove('user');
            this.user = {
                email: '',
                secure:false
            };
            $cookies.putObject('user',this.user);
            $state.go('anon');
        },


        login : function(user) {
            return $http.post('/login', user).then(function(_user){
                this.user = _user.data;
                $cookies.putObject('user',this.user,{'expires':cookieExpireDate});
                $state.go('home');
            },function(e){
                console.log("Login failed "+JSON.stringify(e));
            });
        },

        signup : function(user) {
            return $http.post('/signup', user).then(function(data){
                this.user = data.data;
                $cookies.putObject('user',this.user);
                $state.go('home');
            },function(e){
                console.log("Signup failed "+e);
            });
        },

		forgot: function (email){
			return $http.post('/forgot', {"email":email}).then(function(data){
                // $state.go('home');
            },function(e){
                // console.log("Signup failed "+e);
            });
		},
		reset: function (token,newPassword){
			return $http.post('/reset', {"token":token,"password":newPassword}).then(function(data){
                // $state.go('home');
            },function(e){
                // console.log("Signup failed "+e);
            });
		}
    }
})

app.run(function ($state,$rootScope, $transitions, $location, Account) {
	// When a transition begins, check if it is to a state marked at 'secure' in it's data
	$transitions.onStart({ to: function(state){
		return state.data != null && state.data.secure
	}}, function(trans) {
		// If the user is transitioning to a secure page, get Account service as auth and check login
		var auth = trans.injector().get('Account');
		if (!auth.isLoggedIn()) {
			// User isn't authenticated. Redirect to non-secure page.
			$location.path('/');
			return trans.router.stateService.target('anon');
		}
		//Otherwise, user is logged in and transitioning to secure page. Great!
	});
});
