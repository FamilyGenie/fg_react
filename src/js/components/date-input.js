import React from 'react';
import { connect } from "react-redux";
import moment from 'moment';
// import updateEvent from '../actions/eventsActions';

/********
 this custom component will take in a default value to display. You also pass it the field name the component represents. You also pass in an updateFunction. This function will be called when the user blurs out of the field. The it will pass the value of what the user entered, the field name that is being represented, and the this.state.setState variable. The idea is that you modify the "getOnChange" function to manipulate the user input however you want. Then, when the user blurs, you can set not only the value the user entered, but also the value you created based on their input. Syntax for using the component is:

<DateInput initialValue='12/31/1970' onNewDate={updateDateFunction} />
********/
@connect (
	(store, ownProps) => {
		return ownProps
	}
)
export default class DateInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = { rawDate: this.props.initialValue }
	}

	parseDate = (date) => {
    if (!date) {
      return 'No Date Entered'
    }
    const dateFormat = [
        'M/D/YYYY', 'MM/DD/YYYY', 'MMM/D/YYYY', 'MMM/DD/YYYY', 'MMMM/D/YYYY',
        'MMMM/DD/YYYY', 'D/M/YYYY', 'D/MM/YYYY', 'DD/MM/YYYY', 'DD/MMM/YYYY',
        'D/MMM/YYYY', 'D/MMMM/YYYY', 'DD/MMMM/YYYY', 'DD/MMMM/YYYY',
        'D, M YYYY', 'D MM, YYYY', 'D M, YYYY', 'D MM, YYYY', 'D, MMM YYYY',
        'D MMMM, YYYY', 'D MMM, YYYY', 'D MMMM, YYYY', 'M D, YYYY',
        'MM D, YYYY', 'MMM D, YYYY', 'MMMM D, YYYY', 'M DD, YYYY',
        'MM DD, YYYY', 'MMM DD, YYYY', 'MMMM DD, YYYY',
        'YYYY, M D', 'YYYY, M DD', 'YYYY, MM DD', 'YYYY, MMM DD', 'YYYY M D',
        'YYYY MM D', 'YYYY MMM D', 'YYYY MMMM D', ' YYYY M DD', 'YYYY MM DD',
        'YYYY MMM DD', 'YYYY MMMM DD', 'MMM YYYY', 'MMMM YYYY', 'M, YYYY',
        'MM, YYYY', 'MMM, YYYY', 'MMMM, YYYY', 'YYYY', 'D M', 'D MM', 'D MMM',
        'D MMMM', 'DD M', 'DD MM', 'DD MMM', 'DD MMMM'
    ];

    return moment(date, dateFormat).format('YYYY-MM-DD').toString();
  }

	handleNewDate = (evt) => {
		// have to return a function, because we don't know what evt.target.value is when the this page is rendered (and this function is called)

		 this.setState({
			 rawDate: evt.target.value
		 });
		 this.props.onNewDate(this.parseDate(evt.target.value), evt.target.value);
	}

	render = () => {
		return (
			<div>
				<input
					class="form-control"
					type="text"
					value={this.state.rawDate}
					onChange={this.handleNewDate}
				/>
				<div>
					{this.parseDate(this.state.rawDate)}
				</div>
			</div>
		)
	}
}
