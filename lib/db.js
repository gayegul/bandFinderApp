var Sequelize = require('sequelize');

var sequelize = new Sequelize('band_mates', 'jacobbarnett', null ,{
	host: 'localhost',
	dialect: 'postgres',

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},

});

var User = require('./user_model')(sequelize);
var Approval = require('./approval_model')(sequelize);
var Rejection = require('./rejection_model')(sequelize);


module.exports = {
	sequelize: sequelize, 
	User: User,
	Approval: Approval,
	Rejection: Rejection,
	start: function(callback) {
		User.sync()
		.then(function() {
			return Approval.sync()
			.then(function () {
				return Rejection.sync()
				.then(callback);
			})
		});
	}
};





