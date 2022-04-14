const mongoose = require('mongoose');

// Import PLM module to use  out-of-the-box passport functionality
const plm = require('passport-local-mongoose');

var schemaDefinition = {
	username: String,
	password: String,
	// TODO: add other cool user parameters
};

var userSchema = new mongoose.Schema(schemaDefinition);


userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
