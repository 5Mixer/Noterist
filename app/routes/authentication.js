var User = require("../models/user.js")
module.exports = function (app,passport, db) {
	app.post('/signup',passport.authenticate('local-signup'),function(req,res){
		//req.user now contains their email and bcrypted password
		if (req.user == undefined) next("err");
		res.status(200).json({ "secure": true, "email": req.user.email});
	});

	app.post('/login', passport.authenticate('local-login'),function(req,res){
		if (req.user == undefined) next("err");
		res.status(200).json({ "secure": true, "email": req.user.email});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}
