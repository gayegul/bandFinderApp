'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize, User) {
	var Approvals = sequelize.define('approvals', {
		approving_user: Sequelize.STRING,
		approved_user: Sequelize.STRING,
	});

	return Approvals;
};

