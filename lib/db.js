var Sequelize = require('sequelize');

module.exports = function(testing) {
	var dbSettings = {
		host: 'localhost',
		dialect: 'postgres',
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		}
	};

	if (testing) {
		dbSettings.dialect = 'sqlite';
		dbSettings.storage = '/tmp/database.sqlite';
	}

	var sequelize = new Sequelize('dacmn4rcqb9j3u', 'mvuezguhotuctf', t6nmeyijl59zzcb2Szo1z-mWXH , dbSettings);

	var User = require('./user_model')(sequelize);
	var Approval = require('./approval_model')(sequelize);
	var Rejection = require('./rejection_model')(sequelize);

	return {
		sequelize: sequelize, 
		User: User,
		Approval: Approval,
		Rejection: Rejection,
		start: function(callback) {
			User.sync({force: testing})
			.then(function() {
				return Approval.sync({force: testing})
				.then(function () {
					return Rejection.sync({force: testing})
					.then(callback);
				});
			});
		}
	};
};
