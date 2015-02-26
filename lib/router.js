'use strict';
var db = require('./db');
var bodyparser = require('body-parser');
var sequelize = require('./db').sequelize;

module.exports = function (db, app, passport, appSecret) {
	var auth_handler = require('./eat_auth')(db, appSecret);
	app.use(bodyparser.json());

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

	app.post('/approval', auth_handler, function(req,res) {
		db.Approval.create({
			approving_user: req.body.approving_user,
			approved_user: req.body.approved_user
		}).then(function(approval) {
			res.json(approval);
		},
		function() {
			res.status(500).send({'msg' : 'could not create approval'});	
		});
	});

	app.get('/approval', auth_handler, function(req,res) {
		db.sequelize.query("SELECT username, firstname, lastname, email, location, instruments, bio, phone, track1, track2, track3 FROM approvals INNER JOIN app_users ON approved_user = username WHERE approving_user ='" + req.body.username + "';"
			).then(function(user) {
		 	res.json(user[0]);	
		});
	});

	app.post('/rejection', auth_handler, function(req,res) {
		db.Rejection.create({
			rejecting_user: req.body.rejecting_user,
			rejected_user: req.body.rejected_user
		}).then(function(rejection) {
			res.json(rejection);
		},
		function() {
			res.status(500).send({'msg' : 'could not create rejection'});	
		});
	});
				
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
	
	app.get('/unseen_user', auth_handler, function(req,res) {
		db.sequelize.query("SELECT username, firstname, lastname, email, location, instruments, bio, phone, track1, track2, track3  FROM app_users LEFT OUTER JOIN(SELECT rejected_user AS option FROM rejections WHERE rejecting_user=" + "'" + req.body.username + "'" + " UNION ALL SELECT approved_user AS option FROM approvals WHERE approving_user=" + "'" + req.body.username + "'" + ") as people_union ON username = option WHERE option IS NULL AND username!=" + "'" + req.body.username + "'" + ";"
		).then(function(data){
			res.json(data[0]);
		});
	});
};


