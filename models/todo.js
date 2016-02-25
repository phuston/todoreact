var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Todo = new Schema({
	time: Number,
	content: String,
	completed: Boolean,
}, {collection: 'Todo'});

module.exports = mongoose.model('Todo', Todo);