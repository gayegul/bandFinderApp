'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;

module.exports = function(passport, db) {
	passport.use('basic', new BasicStrategy({}, function(username, password, done) {
		db.User.find({
			where: {
				"username": username
			}
		}).then(function(user) {
			if (!user) return done('could not find user');
			if (!user.validPassword(password)) return done('invalid password');
			return done(null, user);
		});
	}));
};
