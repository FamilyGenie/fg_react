import React from 'react';

export default class DateInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {outputDate: props.defaultValue};
	}

	getOnChange = () => {
		// have to return a function, because we don't know what evt.target.value is when the this page is rendered (and this function is called)
		return (evt) => {
			this.setState( {outputDate: evt.target.value + '00'} );
		}
	}

	getOnBlur = () => {
		return (evt) => {
			console.log("Need to call update here");
		}
	}

	render = () => {
		return (
			<div>
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.defaultValue}
					onChange={this.getOnChange()}
					onBlur={this.getOnBlur()}
				/>
				<div>
					{this.state.outputDate}
				</div>
			</div>
		)
	}
}
