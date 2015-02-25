'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;
var db = require('./db');
var bcrypt = require('bcrypt-nodejs');



module.exports = function(passport) {
	passport.use('basic', new BasicStrategy({}, function(email, password, done) {

		db.User.find( {where: {"email": email}})
			.then(function(user) {
				if(!user) return done('could not find user'); 
				if(!bcrypt.compareSync(password, user.password)) return done('could not authenticate password');
				
				return done(null, user);
			});

	}));
};
