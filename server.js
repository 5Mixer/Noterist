const express = require('express')
const app = express()
const bodyParser = require("body-parser")

const path = require("path")
const fs = require("fs")

const shortid = require('shortid');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Opened connection to mongo server.")
});


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
var cards = require('./app/routes/cards.js')(db)
//var studysheets = require('.app//routes/studysheets.js')(db)
var hierarchy = require('./app/routes/hierarchy.js')(db)
//var glossary = require('./app/routes/glossary.js')(db)
app.use("/cards",cards)
//app.use("/studysheets",studysheets)
//app.use("/glossary",glossary)
//app.use("/hierarchy",hierarchy)

app.listen(8000, () => console.log('Study app active. Port 8000.'))
