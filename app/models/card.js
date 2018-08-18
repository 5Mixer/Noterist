var mongoose = require("mongoose")

module.exports = mongoose.model("card", {
	owner : { type: Schema.Types.ObjectId, default: ''},
	image: : { type: String, default: ''},
	tags : { type: [] }
})
