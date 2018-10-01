var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
	email: String,
	name: String,
	password:String,
	cards: [{ type: mongoose.Schema.ObjectId, ref: 'Card'}],
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

//Methods for working with users.
//// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

    // checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
