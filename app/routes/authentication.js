var User = require("../models/user.js")
module.exports = function (app,passport, db) {
	app.post('/signup',passport.authenticate('local-signup'),function(req,res){
		console.log("/signup post");
		console.log(req.user)
		if (req.user == undefined) next("err");
		res.status(200).json({ "secure": true, "email": req.user.email});
	});

	app.post('/login', passport.authenticate('local-login'),function(req,res){
		console.log("/login post");
		if (req.user == undefined) next("err");
		res.status(200).json({ "secure": true, "email": req.user.email});
	});


	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

/*	Router.post("/signup", function (req, res) {
		if (req.body.email &&
			req.body.username &&
			req.body.password) {

			//At this point the password is cleartext. Hash + salt with bcrypt.
			bcrypt.hash(req.body.password, 10, function (err, hash) {
				if (err) {
					console.log("Bcrypt error! "+err)
				}else{

					var user = {
						email: req.body.email,
						username: req.body.username,
						password: hash
					}

				}
			})

		}
	})*/
}
