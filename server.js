const express = require('express')
const app = express()
const bodyParser = require("body-parser")
var path = require("path")
var fs = require("fs")

var multer  = require('multer')
var upload = multer({ dest: 'tmp/' })

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true, limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'}))

// app.post('/upload', upload.single("file"), function (req, res) {
app.post('/upload', function (req, res) {
	// if (req.file == undefined){
	// 	res.status(500).json({error: "No image."});
	// 	return;
	// }
	// var tempPath = req.file.path,

	var base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');

	var targetPath = path.resolve('./public/cards/'+req.body.title+".jpg");
	fs.writeFile(targetPath, base64Data, 'base64', function(err) {
		if(err) console.log("Error: "+err);
	});

	// fs.rename(tempPath, targetPath, function(err) {
	// 	if (err) throw err;
	// 	//Upload complete
	// });

	res.redirect("back")
	// res.status(200).json({message: "Upload successful."});

	// To delete
	// fs.unlink(tempPath, function (err) {
	// 	if (err) console.log(err);
	// });
});

app.listen(8000, () => console.log('Cards app listening on port 8000!'))
