var express = require("express")
var router = express.Router()
var bcrypt = require("bcrypt")

module.exports = function (db) {
	Router.post("/signup", function (req, res) {
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
	})
}
