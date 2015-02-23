'use strict';
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	basic: {
		email: String,
		password: String
	},
	username: String,
	firstname: String,
	location: String,
	instruments: String,
	bio: String,
	likedUsers:[String],
	unlikedUsers:[String]
});

userSchema.methods.generateToken = function(appSecret, callback) {
	eat.encode({id: this._id, timestamp: new Date()}, appSecret, callback) ;
}

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.basic.password);
};

userSchema.methods.generateToken = function(appSecret, callback) {
	eat.encode({id: this._id, timestamp: new Date()}, appSecret, callback);
};

module.exports = mongoose.model('User', userSchema);
