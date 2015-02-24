'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize, User) {
	var Vote = sequelize.define('Vote', {
		vote: Sequelize.STRING	
	});
	Vote.belongsTo(User, {foreignKey: 'voter'});
	Vote.belongsTo(User, {foreignKey: 'voted'});

	return Vote;
};

