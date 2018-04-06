const express = require('express')
const app = express()
const bodyParser = require("body-parser")

const path = require("path")
const fs = require("fs")

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true, limit: '5mb'}))
app.use(bodyParser.json({limit: '5mb'}))


db.defaults({ cards: [], studysheets: [] }).write()

// Realistically, all cards should have the id's that were generated when they were added.
// However, for example in the case of manual db modification, the server should check that everything has an id. Else stuff breaks!
var cards = db.get("cards").value();
for (var i = 0; i < cards.length; i++){
	if (cards[i].id == undefined)
		cards[i].id = shortid.generate();
}
db.get("cards").merge(cards).write();
cards = undefined;

var cards = require('./routes/cards.js')(db)
app.use("/cards",cards)
var studysheets = require('./routes/studysheets.js')(db)
app.use("/studysheets",studysheets)

app.get("/db", function (req,res){
	res.json(db.value())
})

app.listen(8000, () => console.log('Cards app listening on port 8000!'))
