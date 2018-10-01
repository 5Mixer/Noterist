const express = require('express')
const app = express()
const bodyParser = require("body-parser")

const passport = require("passport")
const session = require('express-session');

const path = require("path")
const fs = require("fs")

const shortid = require('shortid');
require('dotenv').config(); //Load Environment variables from .env

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Opened connection to mongo server.")
});


require("./app/passport")(passport)
app.use(session({ secret: 'supersecretsaucemakescryptostronger' })); // session secret
app.use(passport.initialize());
app.use(passport.session({
	                    cookie: { maxAge: 60000 },
	                    rolling: true,
					resave: true,
saveUninitialized: false})); // persistent login sessions

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true, limit: '5mb'}))
app.use(bodyParser.json({limit: '5mb'}))



// Realistically, all cards should have the id's that were generated when they were added.
// However, for example in the case of manual db modification, the server should check that everything has an id. Else stuff breaks!
/*var cards = db.get("cards").value();
for (var i = 0; i < cards.length; i++){
	if (cards[i].id == undefined)
		cards[i].id = shortid.generate();
}
db.get("cards").merge(cards).write();
cards = undefined;
var terms = db.get("notes").get("glossary").value();
for (var i = 0; i < terms.length; i++){
	if (terms[i].id == undefined)
		terms[i].id = shortid.generate();
}
db.get("glossary").merge(terms).write();
*/


function isLoggedIn(req, res, next) {

		    // if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	//res.redirect('/');
	res.status(401).json({error:"Auth failed or expired"})
}


var cards = require('./app/routes/cards.js')(db,passport)
//var studysheets = require('.app//routes/studysheets.js')(db)
var hierarchy = require('./app/routes/hierarchy.js')(db,passport)
//var glossary = require('./app/routes/glossary.js')(db)
app.use("/cards", isLoggedIn, cards)
app.use(require("./app/routes/forgot")())
require("./app/routes/authentication")(app,passport,db)
//app.use("/studysheets",studysheets)
//app.use("/glossary",glossary)
//app.use("/hierarchy",hierarchy)

app.listen(8000, () => console.log('Study app active. Port 8000.'))
