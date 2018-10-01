var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;
var Card = require("../models/card.js")
var User = require("../models/user.js")

module.exports = function (db,passport) {
	router.get('/', function (req,res) {
		User.findById(req.user._id).populate("cards").exec(function(err,cards){
			res.json(cards.cards)
		})
	})
	router.post('/', function (req, res) {
        User.findById(req.user._id, function(err, user) {
            if (err == undefined) {
				// No error finding the user - user returned from findById

				//if (req.body.file != undefined)
				var base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');

				var targetPath = path.resolve('./public/cards/'+req.body.title+".jpg");
				fs.writeFile(targetPath, base64Data, 'base64', function(err) {
					if(err) console.log("Error: "+err);
				});

				var id = shortid.generate()
				var card = {img: req.body.title+".jpg",title: req.body.title, tags: req.body.tags.split(" "), description: req.body.description, id: id}
				card.uploadedAt = Date.now()

				//db.get("notes").get("cards").push(card).write()

				//db.collection("cards").insert(new Card(card))
				var newCard = new Card(card)

				user.cards.push(newCard._id)

				newCard.save()
				user.save()

				res.json(card)
			}else{
				console.log("couldn't find user to put card into: "+err)
				res.sendStatus(500)
			}
        });

	});

	router.delete('/', function (req,res) {
		var card = req.body
		//TODO: Authentication
		console.log("Deleting card. (Title: "+card.title+")")

		// Searching/deleting based off the full card object seems to fail, probably due to difference in representation of image.
		//db.get("notes").get("cards").remove({id: card.id}).write()
		db.collection("cards").deleteOne({id: card.id}, function (err, result){
			if (err == null) {
				res.sendStatus(200)
			}else{
				res.sendStatus(500)
			}
		})
	})
	router.patch('/', function (req,res) {
		var card = req.body

		db.collection("cards").updateOne({id: card.id}, {$set: {
			img: card.img,
			title: card.title,
			tags: card.tags,
			description: card.description
		}}, function (err, results) {
			if (err == null){
				res.sendStatus(200)
			}else{
				res.sendStatus(500)
				console.log("Error patching card: "+err)
			}
		})
	})

	return router;
}
