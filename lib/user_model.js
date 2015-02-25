'use strict';

var bcrypt = require('bcrypt-nodejs')
var eat = require('eat');
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
	var User = sequelize.define('users', {
		username: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		firstname: Sequelize.STRING,
		lastname: Sequelize.STRING,
		email: Sequelize.STRING,
		password: Sequelize.STRING,
		location: Sequelize.STRING,
		instruments: Sequelize.STRING,
		bio: Sequelize.STRING
	},
	{
		instanceMethods: {
			validPassword: function(password) {
				return bcrypt.compareSync(password, this.password);
			},
			generateToken: function(appSecret, callback) {
				eat.encode({username: this.username, timestamp: new Date()}, appSecret, callback);
			}
		},
		classMethods: {
			generateHash: function(password) {
				return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
			}
		}
	});
	return User;
};
