var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;

module.exports = function (db,passport) {
	router.patch('/', function (req,res) {
		db.get("notes").get("hierarchy").assign(req.body).write()
		res.sendStatus(200)
	})

	return router;
}
