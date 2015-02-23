'use strict';
var bodyparser = require('body-parser');
var User = require('./user_model');
var Vote = require('./votedSchema');

module.exports = function (app, passport, appSecret) {
	app.use(bodyparser.json());

	app.post('/create_user', function(req, res){
		var newUser = new User();
		newUser.basic.email = req.body.email;
		newUser.basic.password = newUser.generateHash(req.body.password);
		newUser.username = req.body.username;
		newUser.firstname = req.body.firstname;
		newUser.location = req.body.location;
		newUser.instruments = req.body.instruments;
		newUser.bio = req.body.bio;
		newUser.save(function(err, user) {
			if (err) return res.status(500).send({'msg': 'could not create user'});
		
			user.generateToken(appSecret, function(err, token){
				if (err) return res.status(500).send({'msg': 'could not create user'});
				res.json({eat: token});
			})
		});
	});

	app.delete('/delete_user/:id', function (req, res){
		User.findOneAndRemove({username: req.params.username}, function(err, User) {
			if (err) return res.status(500).send({'msg': 'could not delete user'});
			res.json(null);
		});
		
	});

	app.get('/show_matches/:id', function (req,res){
		User.find({username: req.params.username, likedUsers: req.params.likedUsers}, function(err, data) {
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


