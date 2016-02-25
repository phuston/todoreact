var TodoFooter = React.createClass({
	render: function () {
		var nowShowing = this.props.nowShowing;
		return (
			<footer className="footer">
				<p className="count">Uncompleted Count: {this.props.count}</p>
				<p className="count">Completed Count: {this.props.completedCount}</p>
				<ul className="filters">
					<li>
						<button className="filterAll" onClick={this.props.onFilterAll}>Show All</button>
					</li>
					{' '}
					<li>
						<button className="filterActive" onClick={this.props.onFilterActive}>Show Active</button>
					</li>
					{' '}
					<li>
						<button className="filterCompleted" onClick={this.props.onFilterComplete}>Show Complete</button>
					</li>
				</ul>
			</footer>
		);
	}
});

module.exports = TodoFooter;