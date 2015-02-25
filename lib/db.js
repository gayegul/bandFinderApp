var Sequelize = require('sequelize');

var sequelize = new Sequelize('test', 'hkn', 'ggb', {
	host: 'localhost',
	dialect: 'sqlite',

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},

	storage: 'lib/db/test.sqlite'
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
		User.sync({force: true})
		.then(function() {
			return Approval.sync({force: true})
			.then(function () {
				return Rejection.sync({force: true})
				.then(callback);
			})
		});
	}
};





