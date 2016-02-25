var classNames = require('classnames');

var ESCAPE_KEY = 27;
var ENTER_KEY = 13;

var TodoItem = React.createClass({
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
        <input
          ref="editField"
          className="edit"
          value={this.state.text}
          onChange={this.onChange}
          onKeyPress={this.handleKey}
          onBlur={this.handleBlur}
        />
    } else {
      var todo =
        <p onClick={this.handleFocus}> {this.props.todo.content} </p>
    }

    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <button className="destroy" onClick={this.props.onDestroy} >X</button>
        </div>
        {todo}
      </li>
    );
  }
});


module.exports = TodoItem;
