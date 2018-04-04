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


db.defaults({ posts: [], user: {}, count: 0 }).write()


app.post('/upload', function (req, res) {
	var base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');

	var targetPath = path.resolve('./public/cards/'+req.body.title+".jpg");
	fs.writeFile(targetPath, base64Data, 'base64', function(err) {
		if(err) console.log("Error: "+err);
	});

	db.get("cards").push({img: req.body.title+".jpg",title: req.body.title, tags: req.body.tags.split(" ")}).write()

	res.redirect("back")
});

app.get("/db", function (req,res){
	res.json(db.value())
})

app.listen(8000, () => console.log('Cards app listening on port 8000!'))
