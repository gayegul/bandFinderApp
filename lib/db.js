var Sequelize = require('sequelize');
var url     = require('url');
    

module.exports = function(testing) {
    var dbSettings, sequelize;

    if(process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
      var dbUrl   = url.parse(process.env.HEROKU_POSTGRESQL_BRONZE_URL);
      dbSettings = {
        dialect:  'postgres',
        protocol: 'postgres',
        host: dbUrl.host,
        port: "",
        logging:  true
      };
      sequelize = new Sequelize(dbUrl.path.substring(1), //dbname
        dbUrl.auth.split(':')[0], dbUrl.auth.split(':')[1], dbSettings);
    } else {
      dbSettings = {
        dialect:  'sqlite',
        host:     'localhost',
        storage:  '/tmp/database.sqlite'
      };
      sequelize = new Sequelize("band_mates", 'gayebulut', null, dbSettings);
    }

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
