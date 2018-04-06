var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;

module.exports = function (db) {
	router.post('/', function (req, res) {
		console.log("Adding card. (Title: "+req.body.title+")")

		var base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');

		var targetPath = path.resolve('./public/cards/'+req.body.title+".jpg");
		fs.writeFile(targetPath, base64Data, 'base64', function(err) {
			if(err) console.log("Error: "+err);
		});

		var id = shortid.generate()
		var card = {img: req.body.title+".jpg",title: req.body.title, tags: req.body.tags.split(" "), description: req.body.description, id: id}
		db.get("cards").push(card).write()

		res.json(card)
	});

	router.delete('/', function (req,res) {
		var card = req.body
		console.log("Deleting card. (Title: "+card.title+")")

		// Deletion goes off title. This could/should be changed to id.
		// Searching/deleting based off the full card object seems to fail, probably due to difference in representation of image.
		db.get("cards").remove({title: card.title}).write()
	})
	router.patch('/', function (req,res) {
		var card = req.body
		console.log("Updating card. (Title: "+card.title+")")
		db.get("cards").find({id:card.id}).merge(card).write()
	})

	return router;
}
