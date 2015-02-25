'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize, User) {
	var Approvals = sequelize.define('approvals', {
		user: Sequelize.STRING,
		approved_user: Sequelize.STRING,
	});

	return Approvals;
};

