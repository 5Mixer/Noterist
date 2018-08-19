var mongoose = require("mongoose")

var cardSchema = {
	img: {type: String, required: true},
	title: {type: String, required: true},
	tags: [{type: String}],
	description: {type:String, required: true},
	id: {type:String, required:true},
	uploadedAt: { type: Date, default: Date.now, required: true}
}

module.exports = mongoose.model('Card', cardSchema)
