// Import mongoose
const mongoose = require('mongoose');

// Expanded definition
const schemaDefinition = {
	name: {
		type: String,
		required: true,
	},
	uid: {
		type: String,
		required: true
	}
};
// Create a new mongoose schema using the definition object
var mongooseSchema = new mongoose.Schema(schemaDefinition);
// Create a new mongoose model using the mongoose schema and export the new model
module.exports = mongoose.model('Action', mongooseSchema);
