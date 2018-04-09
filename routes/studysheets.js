var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;

module.exports = function (db) {
	router.post('/', function (req, res) {
		console.log("Adding studysheet. (Title: "+req.body.title+")")

		// var id = shortid.generate()

		var studysheet = {title: req.body.title, tags: req.body.tags, pages:req.body.pages, id: req.body.id}
		db.get("studysheets").push(studysheet).write()

		res.sendStatus(200)
	});

	router.delete('/', function (req,res) {
		// NOTE: Deletions have no data in req.body except an array of sheet id's! Do not look for other data.
		console.log("Deleting studysheet/s. "+req.body.sheets)

		db.get("studysheets").remove(function(studysheet){ return req.body.sheets.indexOf(studysheet.id) != -1}).write()
		res.sendStatus(200)
	})
	router.patch('/', function (req,res) {
		console.log("Updating studysheet")
		// For images?
		// var base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');

		// var targetPath = path.resolve('./public/studysheets/'+req.body.title+".jpg");
		// fs.writeFile(targetPath, base64Data, 'base64', function(err) {
		// 	if(err) console.log("Error: "+err);
		// });


		var studysheet = req.body
		db.get("studysheets").find({id:studysheet.id}).merge(studysheet).write()
		res.sendStatus(200)
	})

	return router;
}
