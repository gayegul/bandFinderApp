var Sequelize = require('sequelize');

var sequelize = new Sequelize('test', 'hkn', 'ggb', {
	host: 'localhost',
	dialect: 'sqlite',

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},

	storage: 'db/test.sqlite'
});

var User = require('./user_model')(sequelize);
var Vote = require('./vote_model')(sequelize, User);

module.exports = {
	sequelize: sequelize, 
	User: User,
	Vote: Vote,
	start: function(callback) {
		User.sync({force: true})
		.then(function() {
			return Vote.sync({force: true})
			.then(callback)
		});
	}
};





