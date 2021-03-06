var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var path = require("path")
var fs = require("fs")
var db = undefined;

module.exports = function (db) {
	// Warning: Can and probably will lead to headaches with images, html and git if you set these to true
	// Basically, this cleans up the old quill data from base64 to Delta with saved images.
	var clearTextHtml = false;
	var writeImages = false;

	var studysheets = db.get("notes").get("studysheets").value()
	for (var i = 0; i < studysheets.length; i++){
		for (var p = 0; p < studysheets[i].pages.length; p++){
			var page = studysheets[i].pages[p]

			if (clearTextHtml)
				page.text = undefined

			if (page.qtext == undefined)
				continue;
			if (page.qtext.ops == undefined)
				continue;
			if (!writeImages)
				continue;
			for (n = 0; n < page.qtext.ops.length; n++){
				var op = page.qtext.ops[n]
				if (op.insert.image != undefined){
					var base64Data = op.insert.image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
					// console.log(base64Data
					console.log("Processing base64 image")

					if (base64Data.length<200){
						console.log("SKIPPING TINY, Probably URL")
						continue;
					}

					var imgpath = '/qimg/'+studysheets[i].title+" "+p+".jpg"
					var targetPath = path.resolve('./public'+imgpath);
					op.insert.image = imgpath
					fs.writeFile(targetPath, base64Data, 'base64', function(err) {
						if(err) console.log("Error: "+err);
						this.op.insert.image = this.imgpath
						console.log(this.imgpath)

					}.bind({imgpath:imgpath, op:op, qtext:page.qtext}));
				}

			}
		}
	}
	setTimeout(function(){
		db.get("notes").set("studysheets",studysheets).write()

	},2000)

	router.post('/', function (req, res) {
		console.log("Adding studysheet. (Title: "+req.body.title+")")

		var studysheet = {title: req.body.title, tags: req.body.tags, pages:req.body.pages, id: req.body.id}
		db.get("notes").get("studysheets").push(studysheet).write()

		res.sendStatus(200)
	});

	router.delete('/', function (req,res) {
		db.get("notes").get("studysheets").remove(function(studysheet){ return req.body.sheets.indexOf(studysheet.id) != -1}).write()
		res.sendStatus(200)
	})
	router.patch('/', function (req,res) {

		//Any new images introduced in patch MAY BE BASE64 encoded, and should be replaced here.
		var studysheet = req.body
		for (var p = 0; p < studysheet.pages.length; p++){
			var page = studysheet.pages[p]
			for (n = 0; n < page.qtext.ops.length; n++){
				var op = page.qtext.ops[n]
				if (op.insert.image != undefined){
					var base64Data = op.insert.image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
					// console.log(base64Data
					console.log("Processing base64 image")

					if (base64Data.length<200){
						console.log("SKIPPING SMALL IMG, NOT BASE64, PROBABLY URL :/")
						continue;
					}

					var imgpath = '/qimg/'+studysheet.title+" "+p+".jpg"
					var targetPath = path.resolve('./public'+imgpath);
					op.insert.image = imgpath
					fs.writeFile(targetPath, base64Data, 'base64', function(err) {
						if(err) console.log("Error: "+err);
						console.log(this.imgpath)
						console.log(op)
					}.bind({imgpath:imgpath, op:op, qtext:page.qtext}));
					db.get("notes").get("studysheets").find({id:studysheet.id}).assign(studysheet).write()
				}
			}
		}

		db.get("notes").get("studysheets").find({id:studysheet.id}).assign(studysheet).write()
		res.sendStatus(200)
	})

	return router;
}
