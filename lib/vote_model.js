'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize) {
	var Approval = sequelize.define('Approval', {
		user: Sequelize.STRING,
		approved_user: Sequelize.STRING
	});

	return Approval;
};
