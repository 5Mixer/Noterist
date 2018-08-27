var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;
var Card = require("../models/card.js")
var User = require("../models/user.js")

module.exports = function (db,passport) {
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
	router.get('/', function (req,res) {
		console.log("GET card. User: ");
		console.log(req.user)

		User.findById(req.user._id).populate("cards").exec(function(err,cards){
			console.log("Found these cards: ")
			console.log(cards)
			res.json(cards.cards)
		})
		
		/*db.collection("cards").find({}).toArray(function (err,data){
			if (err){
				console.log(err)
				return res(err)
			}else{
				//console.log(data)
				return res.json(data)
			}
		})*/
	})
	router.post('/', function (req, res) {
        User.findById(req.user._id, function(err, user) {
            if (err == undefined) {
				
				
				console.log("Adding card. (Title: "+req.body.title+")")
			
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
				console.log(user.cards)
				console.log(newCard)
				
				newCard.save()
				user.save()

				res.json(card)
			}else{
				console.log("couldn't find user to put card into: "+err)
			}
        });

	});

	router.delete('/', function (req,res) {
		var card = req.body
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
		console.log("Updating card. (Title: "+card.title+")")
		console.log(card)
	
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
				console.log("Error patching: "+err)
			}
		}) 
		//db.get("notes").get("cards").find({id:card.id}).assign(card).write()
	})


	return router;
}
