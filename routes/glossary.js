var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;

module.exports = function (db) {
	router.post('/', function (req, res) {
		console.log("Adding glossary item. (Term: "+req.body.term+")")

		var id = shortid.generate()
		var glossaryItem = {term: req.body.term, definition: req.body.definition, id: id}
		glossaryItem.uploadedAt = Date.now()
		db.get("glossary").push(glossaryItem).write()

		res.json(glossaryItem)
	});

	router.delete('/', function (req,res) {
		var glossaryItem = req.body
		console.log("Deleting glossary item. (Title: "+glossaryItem.term+")")

		db.get("glossary").remove({id: glossaryItem.id}).write()
		res.sendStatus(200);
	})
	router.patch('/', function (req,res) {
		var glossaryItem = req.body
		console.log("Updating glossary item. (Term: "+glossaryItem.term+")")
		db.get("glossary").find({id:glossaryItem.id}).assign(glossaryItem).write()
		res.sendStatus(200);
	})

	return router;
}
