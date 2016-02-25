(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
var ALL_TODOS = '/all';
var ACTIVE_TODOS = '/active';
var COMPLETED_TODOS = '/completed';

var TOGGLE = '/toggle'

var ENTER_KEY = 13;

var TodoItem = require('./todoItem.jsx');
var TodoFooter = require('./todoFooter.jsx')

var TodoApp = React.createClass({displayName: "TodoApp",
  loadTodosFromServer: function() {
    console.log(this.props.url);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(todos) {
        this.setState({todos: todos});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleTodoSubmit: function(newTodo){
    // Optimistic update
    var oldTodos = this.state.todos;
    var optimistic_todos = [newTodo].concat(this.state.todos);
    this.setState({todos: optimistic_todos});

    $.post(this.props.url, newTodo)
      .done(function(data, status){
          console.log('successful save!');
          this.setState({todos: [data].concat(oldTodos)});
      }.bind(this))
      .error(function(data, status){
          this.setState({todos: oldTodos});
          console.error(data);
      });
  },

  handleTodoToggle: function() {
    $.ajax({
      url: this.props.url
    })
  },

  getInitialState: function() {
    return {
      nowShowing: ALL_TODOS,
      editing: null,
      newTodo: '',
      todos: []
    }
  },

  handleChange: function (event) {
    this.setState({newTodo: event.target.value});
  },

  filterActive: function() {
    this.setState({nowShowing: ACTIVE_TODOS});
  },

  filterComplete: function() {
    this.setState({nowShowing: COMPLETED_TODOS});
  },

  filterAll: function() {
    this.setState({nowShowing: ALL_TODOS});
  },

  componentDidMount: function() {
    this.loadTodosFromServer();
    setInterval(this.loadTodosFromServer, this.props.pollInterval);
  },

  toggle: function (todoToToggle) {
    var newTodos = this.state.todos.map(function(todo){
      if( todo.time == todoToToggle.time ){
        todo.completed = !todo.completed;
      }
      return todo;
    });

    this.setState({todos: newTodos});

    $.post(this.props.url + '/completeTodo', {time:todoToToggle.time} )
      .done(function(data, status){
      })
      .error(function(data, status){
          console.error(data);
      });
  },

  destroy: function (todo) {

    this.setState({todos: this.state.todos.filter(function(todo_){
      return todo_.time !== todo.time
    })});

    $.post(this.props.url + '/delete', todo )
      .done(function(data, status){
      })
      .error(function(data, status){
          console.error(data);
      });
  },

  edit: function (todo) {
    console.log("editing");
    this.setState({editing: todo.id});
  },

  save: function (todoToSave, text) {
    this.setState({editing: null});
  },

  cancel: function () {
    this.setState({editing: null});
  },

  handleTodoEdit: function(todo){

    console.log(todo);
    var editedTodos = this.state.todos.map(function(todo_){
      if (todo_.time == todo.time) {
        todo_.content = todo.text;
      }
      console.log("NEW TODO");
      console.log(todo_);
      return todo_;
    });

    this.setState({todos: editedTodos});

    $.post(this.props.url + '/edit', {time:todo.time, content:todo.text})
      .done(function(data,status){
      }.bind(this))
      .error(function(data, status){
          console.error(data);
      });
  },

  handleNewTodoKeyDown: function (event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = this.state.newTodo.trim();

    var newTodo = 
    {
      content: val,
      time: Date.now(),
      completed: false
    }

    if (val) {
      this.handleTodoSubmit(newTodo);
      this.setState({newTodo: ''});
    }
  },

  render: function () {

    var footer;
    var main;
    var todos = this.state.todos;

    var shownTodos = todos.filter(function (todo) {
      switch (this.state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
      }
    }, this);

    var todoItems = shownTodos.map(function (todo) {
      return (
        React.createElement(TodoItem, {
          key: todo.time, 
          todo: todo, 
          onToggle: this.toggle.bind(this, todo), 
          onDestroy: this.destroy.bind(this, todo), 
          onEdit: this.edit.bind(this, todo), 
          editTodo: this.handleTodoEdit, 
          editing: this.state.editing === todo.time, 
          onSave: this.save.bind(this, todo), 
          onCancel: this.cancel}
        )
      );
    }, this);

    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        React.createElement(TodoFooter, {
          count: activeTodoCount, 
          completedCount: completedCount, 
          nowShowing: this.state.nowShowing, 
          onFilterActive: this.filterActive, 
          onFilterComplete: this.filterComplete, 
          onFilterAll: this.filterAll}
        );
    }

    if (todos.length) {
      main = (
        React.createElement("section", {className: "main"}, 
          React.createElement("ul", {className: "todo-list"}, 
            todoItems
          )
        )
      );
    }

    return (
      React.createElement("div", null, 
        React.createElement("header", {className: "header"}, 
          React.createElement("h1", null, "todos"), 
          React.createElement("input", {
            className: "new-todo", 
            placeholder: "What needs to be done?", 
            value: this.state.newTodo, 
            onKeyDown: this.handleNewTodoKeyDown, 
            onChange: this.handleChange, 
            autoFocus: true}
          )
        ), 
        main, 
        footer
      )
    );
  }
});


ReactDOM.render(
  React.createElement(TodoApp, {url: "/api/todos", pollInterval: 200000}),
  document.getElementById('content')
);
},{"./todoFooter.jsx":3,"./todoItem.jsx":4}],3:[function(require,module,exports){
var TodoFooter = React.createClass({displayName: "TodoFooter",
	render: function () {
		var nowShowing = this.props.nowShowing;
		return (
			React.createElement("footer", {className: "footer"}, 
				React.createElement("p", {className: "count"}, "Uncompleted Count: ", this.props.count), 
				React.createElement("p", {className: "count"}, "Completed Count: ", this.props.completedCount), 
				React.createElement("ul", {className: "filters"}, 
					React.createElement("li", null, 
						React.createElement("button", {className: "filterAll", onClick: this.props.onFilterAll}, "Show All")
					), 
					' ', 
					React.createElement("li", null, 
						React.createElement("button", {className: "filterActive", onClick: this.props.onFilterActive}, "Show Active")
					), 
					' ', 
					React.createElement("li", null, 
						React.createElement("button", {className: "filterCompleted", onClick: this.props.onFilterComplete}, "Show Complete")
					)
				)
			)
		);
	}
});

module.exports = TodoFooter;
},{}],4:[function(require,module,exports){
var classNames = require('classnames');

var ESCAPE_KEY = 27;
var ENTER_KEY = 13;

var TodoItem = React.createClass({displayName: "TodoItem",
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  onChange: function(text){
    this.setState({text: text.target.value});
  },

  sendUpdate: function(){
    this.props.editTodo({time: this.props.todo.time, text: this.state.text});
    this.setState({text: this.state.text, editing: false});
  },

  handleKey: function(key){
      if( key.charCode == 13 || key.keyCode == 13 ){
          key.preventDefault();
          var text = this.state.text;
          if( !text ){
              return;
          }

          this.sendUpdate();
      }
  },

  handleBlur: function(){
    this.sendUpdate();
  },

  handleFocus: function(){
    this.setState({editing: true});
  },

  getInitialState: function () {
    return {editing: false, text: this.props.todo.content};
  },

  render: function () {
    if (this.state.editing) {
      var todo = 
        React.createElement("input", {
          ref: "editField", 
          className: "edit", 
          value: this.state.text, 
          onChange: this.onChange, 
          onKeyPress: this.handleKey, 
          onBlur: this.handleBlur}
        )
    } else {
      var todo =
        React.createElement("p", {onClick: this.handleFocus}, " ", this.props.todo.content, " ")
    }

    return (
      React.createElement("li", {className: classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}, 
        React.createElement("div", {className: "view"}, 
          React.createElement("input", {
            className: "toggle", 
            type: "checkbox", 
            checked: this.props.todo.completed, 
            onChange: this.props.onToggle}
          ), 
          React.createElement("button", {className: "destroy", onClick: this.props.onDestroy}, "X")
        ), 
        todo
      )
    );
  }
});


module.exports = TodoItem;

},{"classnames":1}]},{},[2]);
