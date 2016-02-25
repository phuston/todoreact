var ALL_TODOS = '/all';
var ACTIVE_TODOS = '/active';
var COMPLETED_TODOS = '/completed';

var TOGGLE = '/toggle'

var ENTER_KEY = 13;

var TodoItem = require('./todoItem.jsx');
var TodoFooter = require('./todoFooter.jsx')

var TodoApp = React.createClass({
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
        <TodoItem
          key={todo.time}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editTodo={this.handleTodoEdit}
          editing={this.state.editing === todo.time}
          onSave={this.save.bind(this, todo)}
          onCancel={this.cancel}
        />
      );
    }, this);

    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onFilterActive={this.filterActive}
          onFilterComplete={this.filterComplete}
          onFilterAll={this.filterAll}
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={this.state.newTodo}
            onKeyDown={this.handleNewTodoKeyDown}
            onChange={this.handleChange}
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
});


ReactDOM.render(
  <TodoApp url="/api/todos" pollInterval={200000} />,
  document.getElementById('content')
);