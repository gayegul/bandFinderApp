'use strict';

var express = require('express');
var mongoose = require('mongoose');
var userRoutes = require('./router');


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/band_finder_users');

var app = express();
var userRouter = express.Router();
userRoutes(userRouter);

app.use('/api', userRouter);
app.listen(process.env.PORT || 3434, function() {
	console.log('Server listening on port ' + (process.env.PORT || 3434));
});