'use strict';

var eat = require('eat');

module.exports = function(db, appSecret) {
	return function(req, res, next) {
		var token = req.headers.eat || req.body.eat;
		if(!token) return res.status(403).send({msg: 'could not authenticate - no token'});

		eat.decode(token, appSecret, function(err, decoded) {
			if (err) return res.status(403).send({msg: 'could not authenticate - decoding error'});

			return db.User.find({
				where: {
					username: decoded.username		
				}
			}).then(function(user) {
				req.user = user;
				next();
			}, function() {
	 			res.status(403).send({'msg': 'could not authenticate'});	
			});
		});
	};
};