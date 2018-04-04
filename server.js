const express = require('express')
const app = express()
const bodyParser = require("body-parser")

const path = require("path")
const fs = require("fs")

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

var shortid = require('shortid');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true, limit: '5mb'}))
app.use(bodyParser.json({limit: '5mb'}))


db.defaults({ posts: [], user: {}, count: 0 }).write()

// Realistically, all cards should have the id's that were generated when they were added.
// However, for example in the case of manual db modification, the server should check that everything has an id. Else stuff breaks!
var cards = db.get("cards").value();
for (var i = 0; i < cards.length; i++){
	if (cards[i].id == undefined)
		cards[i].id = shortid.generate();
}
db.get("cards").merge(cards).write();
cards = undefined;


app.post('/cards', function (req, res) {
	console.log("Adding card. (Title: "+req.body.title+")")

	var base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');

	var targetPath = path.resolve('./public/cards/'+req.body.title+".jpg");
	fs.writeFile(targetPath, base64Data, 'base64', function(err) {
		if(err) console.log("Error: "+err);
	});

	var id = shortid.generate()
	var card = {img: req.body.title+".jpg",title: req.body.title, tags: req.body.tags.split(" "), id: id}
	db.get("cards").push(card).write()

	res.json(card)
});

app.delete('/cards', function (req,res) {
	var card = req.body
	console.log("Deleting card. (Title: "+card.title+")")

	// Deletion goes off title. This could/should be changed to id.
	// Searching/deleting based off the full card object seems to fail, probably due to difference in representation of image.
	db.get("cards").remove({title: card.title}).write()
})
app.patch('/cards', function (req,res) {
	var card = req.body
	console.log("Updating card. (Title: "+card.title+")")
	db.get("cards").find({id:card.id}).merge(card).write()
})

app.get("/db", function (req,res){
	res.json(db.value())
})

app.listen(8000, () => console.log('Cards app listening on port 8000!'))
