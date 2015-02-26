'use strict';

var Sequelize = require('sequelize');

module.exports = function (sequelize, User) {
	var Rejection = sequelize.define('rejections' , {
		rejecting_user: Sequelize.STRING,
		rejected_user: Sequelize.STRING 
	});

	return Rejection;
};
