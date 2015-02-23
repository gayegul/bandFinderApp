'use strict';
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var User = require('./user_model');

module.exports = function (app) {
	app.use(bodyparser.json());

	app.post('/create_user', function(req, res){
		var newUser = new User();
		newUser.basic.email = req.body.email;
		newUser.basic.password = req.body.password;
		newUser.username = req.body.username;
		newUser.firstname = req.body.firstname;
		newUser.location = req.body.location;
		newUser.instruments = req.body.instruments;
		newUser.bio = req.body.bio;
		newUser.save(function(err, user) {
			if (err) return res.status(500).send({'msg': 'could not create user'});
		});
		res.send("success");
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

	/*app.get('/user/:username', function (req,res){
		User.find({username: req.params.username, likedUsers: req.params.likedUsers}, function(err, data) {
			if (err) return res.status(500).send({'msg' : 'could not find liked users'})
			res.json(data);
		});
	});*/
};


