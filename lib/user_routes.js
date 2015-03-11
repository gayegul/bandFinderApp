'use strict';
var db = require('./db');
var bodyparser = require('body-parser');
var sequelize = require('./db').sequelize;

module.exports = function (db, app, passport, appSecret) {
	var auth_handler = require('./eat_auth')(db, appSecret);
	app.use(bodyparser.json());

	//creates new user, hashes password, returns EAT
	app.post('/user', function(req, res) {
		db.User.create({
			username: req.body.username,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			password: db.User.generateHash(req.body.password),
			location: req.body.location,
			instruments: req.body.instruments,
			bio: req.body.bio,
			phone: req.body.phone,
			track1: req.body.track1,
			track2: req.body.track2,
			track3: req.body.track3
		}).then(function(user) {
			user.generateToken(appSecret, function(err, token) {
				if (err) return res.status(500).send({'msg': 'could not create user'});
				res.json({eat: token});
			});
		},
		function(err) {
			res.status(500).send({'msg': 'could not create user'});
		});
	});


	//delete user
	app.delete('/user', auth_handler, function (req, res) {
		db.User.destroy({
			where: {
				username: req.user.username
			}
		}).then(function(n) {
			res.json({'msg': 'deleted ' + n + ' rows'});
		},
		function() {
			res.status(500).send({'msg': 'could not delete user'});
		});
	});


	//returns user data for a specified user
	app.get('/user/:username', auth_handler, function(req, res) {
		db.User.find({
			where: {
				username: req.params.username
			}
		}).then(function(user) {
			if (!user) return res.status(404).send({'msg': 'user ' + req.params.username + ' does not exist'});
		 	res.json(user);
		},
		function() {
 			res.status(500).send({'msg': 'could not show user'});
		});
	});

	//gets a new token for an existing user
	app.get('/sign_in', passport.authenticate('basic', {session: false}), function(req ,res){
		db.User.find({
			email: req.body.username,
			password: db.User.generateHash(req.body.password)
		}).then(function(user) {
			user.generateToken(appSecret, function(err, token) {
				if (err) return res.status(500).send({'msg': 'could not create user'});
				res.json({eat: token});
			});
		});
	});

};
