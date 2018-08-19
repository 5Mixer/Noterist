app.factory('Account', function($state,$http, $rootScope, $cookies) {

    //This function doesn't rely on (potentially old) cookies, it just asks the server
    //if this session is currently authorised, allowing for cases such as the server
    //being restarted (and thus lost sessions)
    function isLoggedInCheck (){
        $http.get('/user').then(function(response){
            var data = response.data;
            return data.secure;
        })
    }

    currentUser = $cookies.getObject('user') || { email: '', secure: false };



    var cookieExpireDate = new Date();
    cookieExpireDate.setDate(cookieExpireDate.getDate() + 1);

    return {
        user: currentUser,

        getAccount: function (){
            console.log("Got account");
            if ($cookies.getObject('user') != undefined){
                return $cookies.getObject('user')
            }else{
                return { email: '', secure: false };
            }
        },

        isLoggedIn : function (){
            return ($cookies.getObject('user') != undefined) ? $cookies.getObject('user').secure : false;
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
                console.log("Login post returned "+JSON.stringify(user))
                this.user = _user.data;
                $cookies.putObject('user',this.user,{'expires':cookieExpireDate});
                console.log("Login Worked "+$cookies.get('user'));
                $state.go('home');
            },function(e){
                console.log("Login failed "+e);
            });
        },

        signup : function(user) {
            return $http.post('/signup', user).then(function(user){
                this.user = user;
                $cookies.putObject('user',this.user);
                console.log("Signup Worked "+JSON.stringify(this.user));
                $state.go('home');
            },function(e){
                console.log("Signup failed "+e);
            });
        }
    }

})
app.run(function ($state,$rootScope, $transitions, $location, Account) {

	$transitions.onStart({ to: function(state){
		return state.data != null && state.data.secure
	}}, function(trans) {
		var auth = trans.injector().get('Account');
		if (auth.isLoggedIn() == false) {
			// User isn't authenticated. Redirect to a new Target State
            $location.path('/');
			return trans.router.stateService.target('anon');
		}
	});

/*
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
	console.log("state change")
		console.log("$stateChangeStart " + fromState.name + JSON.stringify(fromParams) + " -> " + toState.name + JSON.stringify(toParams));
        if (toState.data == undefined){
            console.log("Initial page load/No Secuirity specification.");
            return;
        }
        console.log(toState);
        console.log("Changing page. Next page is secure: "+toState.data.secure);

        if (toState.data.secure == true && Account.isLoggedIn() == false) {
            console.log("Redirecting to /login because account secure: "+Account.isLoggedIn()+" and next page secure:"+toState.data.secure);
            event.preventDefault();
            $location.path('/');
            $state.go('anon');
        }
        if (toState.data.secure == false && Account.isLoggedIn() == true) {
            console.log("Redirecting to / because account secure: "+Account.isLoggedIn()+" and next page secure:"+toState.data.secure);
            event.preventDefault();
            $state.go('user.home');
            $location.path('/');
        }
    });*/
});
