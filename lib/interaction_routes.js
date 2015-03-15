'use strict';
/*jshint multistr: true */
var db = require('./db');
var bodyparser = require('body-parser');
var sequelize = require('./db').sequelize;

module.exports = function (db, app, passport, appSecret) {
var auth_handler = require('./eat_auth')(db, appSecret);
app.use(bodyparser.json());

//adds an approving user and an approved user to the approvals table
app.post('/approval', auth_handler, function(req,res) {
  db.Approval.create({
    approving_user: req.body.approving_user,
    approved_user: req.body.approved_user
  }).then(function(approval) {
    res.json(approval);
  },
  function() {
    res.status(500).send({'msg' : 'could not create approval'});
  });
});

//gets an array of all approved users for a specified user
app.get('/approval/:username', auth_handler, function(req,res) {
  db.sequelize.query(
    "SELECT username, firstname, lastname, email, location, instruments, \
    bio, phone, track1, track2, track3 \
    FROM approvals INNER JOIN app_users ON approved_user = username \
    WHERE approving_user ='" + req.params.username + "';"
  ).then(function(user) {
     res.json(user[0]);
  });
});

//adds a rejecting user and a rejected user to the rejections table
app.post('/rejection', auth_handler, function(req,res) {
  db.Rejection.create({
    rejecting_user: req.body.rejecting_user,
    rejected_user: req.body.rejected_user
  }).then(function(rejection) {
    res.json(rejection);
  },
  function() {
    res.status(500).send({'msg' : 'could not create rejection'});
  });
});

/* for a specified user, returns an array of users that have not been rejected
or approved  */
app.get('/unseen_user/:username', auth_handler, function(req,res) {
  db.sequelize.query(
    "SELECT username, firstname, lastname, email, location, instruments, \
    bio, phone, track1, track2, track3  \
    FROM app_users LEFT OUTER JOIN(SELECT rejected_user \
    AS option FROM rejections WHERE rejecting_user= \
    '" + req.params.username + "'UNION ALL SELECT \
    approved_user AS option FROM approvals WHERE approving_user= \
    '" + req.params.username + "') as people_union \
    ON username = option \
    WHERE option IS NULL AND username!=\
    '" + req.params.username + "';"
  ).then(function(data){
    res.json(data[0]);
  });
});
};
