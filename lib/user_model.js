'use strict';

var bcrypt = require('bcrypt-nodejs')
var eat = require('eat');
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
	var User = sequelize.define('User', {
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
				return bcrypt.compareSync(password, this.basic.password);
			},
			generateToken: function(appSecret, callback) {
				eat.encode({id: this._id, timestamp: new Date()}, appSecret, callback);
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
