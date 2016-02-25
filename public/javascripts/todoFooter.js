(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1]);
