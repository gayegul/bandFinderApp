'use strict';

var express = require('express');
var mongoose = require('mongoose');
var userRoutes = require('./lib/router');
var passport = require('passport');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/band_finder_users');


var app = express();
app.set('appSecret', process.env.SECRET || 'changethis!');
app.use(passport.initialize());
require('./lib/passport')(passport);

var userRouter = express.Router();

require('./lib/router')(userRouter, passport, app.get('appSecret'));

app.use('/api', userRouter);

app.listen(process.env.PORT || 3434, function() {
	console.log('Server listening on port ' + (process.env.PORT || 3434));
});
