var express = require('express');
var router = express.Router();

var Todo = require('../models/todo.js');

/* GET all todos. */
router.get('/todos', function(req, res, next) {
	Todo.find({}).sort({id:-1}).exec(function(err, todos){
		if(err){ console.error(err); }
		res.json(todos);
	});

});

router.post('/todos', function(req, res, next) {

	var todo = new Todo({
		content: req.body.content,
		time: Date.now(),
		completed: false
	});

	todo.save(function(err, todo){
		if (err) console.log(err);
		res.json(todo);
	});
});

router.post('/todos/delete', function(req, res, next){
	Todo.remove({time: req.body.time})
		.exec(function(err, task){
			res.json({});
		});
});

router.post('/todos/edit', function(req, res, next){
	console.log(req.body)
    Todo.findOneAndUpdate({time: req.body.time}, {content:req.body.content})
        .exec(function(err, result){
            if(err) console.error(err);
			res.json({});
        });
})

router.post('/todos/completeTodo', function(req, res, next){
	Todo.findOneAndUpdate({time: req.body.time}, {completed: true})
        .exec(function(err, data){
            if(err) console.error(err);
            console.log("complete");
    		res.json({});
        });
})

module.exports = router;
