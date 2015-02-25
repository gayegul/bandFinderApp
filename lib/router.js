'use strict';

var bodyparser = require('body-parser');

module.exports = function (db, app, passport, appSecret) {
	app.use(bodyparser.json());
	app.post('/create_user', function(req, res) {
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

	app.get('/show_user/:username', function(req, res) {
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


	app.post('/approval', function(req,res){
		db.Approval.create({
			user: req.body.user,
			approved_user: req.body.approved_user
		}).then(function(approval){
			res.json(approval);
		},
		function() {
			res.status(500).send({'msg' : 'could not create approval'});	
		});
	});

	app.post('/rejection', function(req,res){
		db.Rejection.create({
			user: req.body.user,
			rejected_user: req.body.rejected_user
		}).then(function(rejection){
			res.json(rejection);
		},
		function() {
			res.status(500).send({'msg' : 'could not create rejection'});	
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


