var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;

module.exports = function (db) {
	router.patch('/', function (req,res) {
		var studysheet = req.body
		console.log("Modifying hierarchy.")

		// Deletion goes off title. This could/should be changed to id.
		// Searching/deleting based off the full studysheet object seems to fail, probably due to difference in representation of image.
		db.get("hierarchy").assign(req.body).write()
		res.send(db.get("hierarchy"))
	})

	return router;
}
