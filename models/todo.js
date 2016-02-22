var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Todo = new Schema({
	_id: {type: String},
	content: String,
	done: boolean,
}, {collection: 'Todo'});

module.exports = mongoose.model('Todo', Todo);