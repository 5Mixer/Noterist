var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;

module.exports = function (db) {
	// var cards = db.get("cards").value()
	// for (var c = 0; c < cards.length; c++){
	// 	if (cards[c].stats == undefined){
	// 		cards[c].stats = {
	// 			flags: {
	// 				strength: 0,
	// 				weakness: 0,
	// 				important: 0
	// 			},
	// 			presented: 0
	// 		}
	// 	}
	// }
	// setTimeout(function(){
	// 	console.log("saving")
	// 	db.set("cards",cards).write()
	//
	// },2000)

	router.post('/', function (req, res) {
		console.log("Adding card. (Title: "+req.body.title+")")

		var base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');

		var targetPath = path.resolve('./public/cards/'+req.body.title+".jpg");
		fs.writeFile(targetPath, base64Data, 'base64', function(err) {
			if(err) console.log("Error: "+err);
		});

		var id = shortid.generate()
		var card = {img: req.body.title+".jpg",title: req.body.title, tags: req.body.tags.split(" "), description: req.body.description, id: id}
		card.uploadedAt = Date.now()
		db.get("cards").push(card).write()

		res.json(card)
	});

	router.delete('/', function (req,res) {
		var card = req.body
		console.log("Deleting card. (Title: "+card.title+")")

		// Searching/deleting based off the full card object seems to fail, probably due to difference in representation of image.
		db.get("cards").remove({id: card.id}).write()
		res.sendStatus(200);
	})
	router.patch('/', function (req,res) {
		var card = req.body
		console.log("Updating card. (Title: "+card.title+")")
		console.log(card)
		db.get("cards").find({id:card.id}).assign(card).write()
		res.sendStatus(200);
	})


	return router;
}
