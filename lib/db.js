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

/*
var unseenQuery = function(){
	sequelize.query(
	"SELECT username FROM users LEFT OUTER JOIN" +
	"(SELECT rejected_user AS option FROM rejections WHERE user=req.body.username UNION ALL  SELECT approved_user AS option FROM approvals WHERE user=req.body.username)" +
	"ON username = option WHERE option IS NULL AND username IS NOT req.body.username"
);
};
*/


var User = require('./user_model')(sequelize);
var Approval = require('./approval_model')(sequelize);
var Rejection = require('./rejection_model')(sequelize);


module.exports = {
//	unseenQuery : unseenQuery,
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





