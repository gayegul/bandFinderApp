'use strict';

var express = require('express');
var db = require('./lib/db');
var passport = require('passport');


var app = express();
app.set('appSecret', process.env.SECRET || 'changethis!');
app.use(passport.initialize());
require('./lib/passport')(passport);

var userRouter = express.Router();

require('./lib/router')(db, userRouter, passport, app.get('appSecret'));

app.use('/api', userRouter);

db.start(function() {
	app.listen(process.env.PORT || 3434, function() {
		console.log('Server listening on port ' + (process.env.PORT || 3434));
	});
});

