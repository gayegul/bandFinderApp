var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	basic: {
		email: String,
		password: String
	},
	userName: String,
	firstName: String,
	location: String,
	instruments: String,
	bio: String,
	likedUsers:[String],
	unlikedUsers:[String]
});

module.exports = mongoose.model('User', userSchema);
