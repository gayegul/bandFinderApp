'use strict';

var mongoose = require('mongoose');

var votedSchema = new mongoose.Schema({
	voting_id: String,
	voted_id: String,
	liked: Boolean
});

module.exports = mongoose.model('Vote', votedSchema);