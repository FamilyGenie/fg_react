import React from 'react';
import { connect } from "react-redux";

/********
 this custom component will take in a default value to display. You also pass it the field name the component represents. You also pass in an updateFunction. This function will be called when the user blurs out of the field. The it will pass the value of what the user entered, the field name that is being represented, and the this.state.setState variable. The idea is that you modify the "getOnChange" function to manipulate the user input however you want. Then, when the user blurs, you can set not only the value the user entered, but also the value you created based on their input. Syntax for using the component is:

<DateInput defaultValue='12/31/1970' field="testDate" updateFunction={this.getUpdateDate().bind(this)} />
********/
@connect (
	(store, ownProps) => {
		return ownProps
	}
)
export default class DateInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {setDate: props.defaultValue};
	}

	getOnChange = () => {
		// have to return a function, because we don't know what evt.target.value is when the this page is rendered (and this function is called)
		return (evt) => {
			this.setState( {setDate: evt.target.value.substr(0,4) + '00'} );
		}
	}

	getOnBlur = () => {
		return (evt) => {
			console.log("Need to call update here. The function to update needs to come through the props.", this.props.field);
			this.props.updateFunction(this.props.field, evt.target.value, this.state.setDate);
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
					{this.state.setDate}
				</div>
			</div>
		)
	}
}
