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
