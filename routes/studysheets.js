var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;

module.exports = function (db) {
	router.post('/', function (req, res) {
		console.log("Adding studysheet. (Title: "+req.body.title+")")

		var base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');

		var targetPath = path.resolve('./public/studysheets/'+req.body.title+".jpg");
		fs.writeFile(targetPath, base64Data, 'base64', function(err) {
			if(err) console.log("Error: "+err);
		});

		var id = shortid.generate()
		var studysheet = {img: req.body.title+".jpg",title: req.body.title, tags: req.body.tags.split(" "), description: req.body.description, id: id}
		db.get("studysheets").push(studysheet).write()

		res.json(studysheet)
	});

	router.delete('/', function (req,res) {
		var studysheet = req.body
		console.log("Deleting studysheet. (Title: "+studysheet.title+")")

		// Deletion goes off title. This could/should be changed to id.
		// Searching/deleting based off the full studysheet object seems to fail, probably due to difference in representation of image.
		db.get("studysheets").remove({title: studysheet.title}).write()
	})
	router.patch('/', function (req,res) {
		var studysheet = req.body
		console.log("Updating studysheet. (Title: "+studysheet.title+")")
		db.get("studysheets").find({id:studysheet.id}).merge(studysheet).write()
	})

	return router;
}
