'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;

module.exports = function(passport, db) {
	passport.use('basic', new BasicStrategy({}, function(email, password, done) {
		db.User.find({
			where: {
				"email": email
			}
		}).then(function(user) {
			if (!user) return done('could not find user');
			if (!user.validPassword(password)) return done('invalid password');
			return done(null, user);
		});
	}));
};
