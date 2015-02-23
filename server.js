'use strict';

var express = require('express');
var mongoose = require('mongoose');



var app = express();
var userRouter = express.Router();

app.listen(process.env.PORT || 3434, function() {
	console.log('Server listening on port ' + (process.env.PORT || 3434));
});