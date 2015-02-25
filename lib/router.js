'use strict';
var bodyparser = require('body-parser');
var User = require('./user_model');
var Vote = require('./votedSchema');

module.exports = function (db, app, passport, appSecret) {
	app.use(bodyparser.json());

	app.post('/create_user', function (req, res) {
		db.User.create({
			username: req.body.username,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			password: db.User.generateHash(req.body.password),
			location: req.body.location,
			instruments: req.body.instruments,
			bio: req.body.bio
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

	app.delete('/delete_user/:username', function (req, res) {
		db.User.destroy({
			where: {
				username: req.params.username
			}
		}).then(function(n) {
			res.json({'msg': 'deleted '+ n +' rows'});
		},
		function() {
			res.status(500).send({'msg': 'could not delete user'});
		});
	});

	app.get('/get_user/:username', function (req, res) {
		return db.User.find({
			where: {
				username: req.params.username
			}
		}).then(function(user) {
			console.log(req.params);
			res.json(user);
		},
		function() {
			res.status(500).send({'msg': 'could not show user'});
		});
	});

/*	app.get('/show_votes/:username', function(req, res) {
		db.User.find({
			where: {
				username: req.params.username
			}
		}).then(function() {

		})

	});
*/
	app.post('/create_vote/:username', function (req, res) {
		db.Vote.create({
			where: {
				voter: req.params.username,
				voted: req.body.voted,
				vote: true
			}
		}).then(function(vote) {
			res.json(vote)
		},
		function() {
			res.status(500).send({'msg': 'could not create vote'});
		});
	});
	
/*
	app.get('/show_matches/:username', function (req,res){
		db.User.find({username: req.params.username, likedUsers: req.params.likedUsers}, function(err, data) {
			if (err) return res.status(500).send({'msg' : 'could not find liked users'})
			res.json(data);
		});
	});

	app.get('/sign_in' , passport.authenticate('basic', {session: false}), function(req ,res) {
		req.user.generateToken(appSecret, function (err, token) {
			if (err) return res.status(500).send({'msg' : 'could not generate token'});
			res.json({eat:token});
		});
	});

	app.post('/vote_user', function(req, res) {
		var vote = new Vote();
		vote.voting_id = req.body.voting_id;
		vote.voted_id = req.body.voted_id;
		vote.liked = req.body.vote;
		vote.save(function(err, data) {
			if (err) return res.status(500).send({'msg': 'could not create user'});
			res.json(data);
		});

	});

	/*app.get('/user/:username', function (req,res){
		User.find({username: req.params.username, likedUsers: req.params.likedUsers}, function(err, data) {
			if (err) return res.status(500).send({'msg' : 'could not find liked users'})
			res.json(data);
		});
	});*/
};


