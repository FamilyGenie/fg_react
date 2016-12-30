import React from 'react';
import { connect } from "react-redux";
import moment from 'moment';

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

		var newDate = this.parseDate(props.defaultValue);
		this.state = {setDate: newDate};
	}

	parseDate = (date) => {
		    var dateFormat = [
		      'M/D/YY', 'M/D/YYYY', 'MM/DD/YY', 'MM/DD/YYYY', 'MMM/D/YY',
		        'MMM/DD/YY', 'MMM/D/YYYY', 'MMM/DD/YYYY', 'MMMM/D/YY', 'MMMM/DD/YY',
		        'MMMM/D/YYYY', 'MMMM/DD/YYYY', 'D/M/YY', 'D/MM/YY', 'D/M/YYYY',
		        'D/MM/YYYY', 'DD/M/YY', 'DD/MM/YYYY', 'DD/MM/YY', 'DD/MMM/YYYY','D/MMM/YY',
		        'D/MMMM/YY', 'D/MMM/YYYY', 'D/MMMM/YYYY', 'DD/MMM/YY', 'DD/MMMM/YYYY',
		        'DD/MMMM/YY', 'DD/MMMM/YYYY', 'D, M YY', 'D, M YYYY', 'D MM, YY',
		        'D MM, YYYY', 'D M, YY', 'D M, YYYY', 'D MM, YY', 'D MM, YYYY', 'D, MMM YY',
		        'D, MMM YYYY', 'D MMMM, YY', 'D MMMM, YYYY', 'D MMM, YY', 'D MMM, YYYY',
		        'D MMMM, YY', 'D MMMM, YYYY', 'M D, YY', 'MM D, YY', 'MMM D, YY', 'MMMM D, YY',
		        'M D, YYYY', 'MM D, YYYY', 'MMM D, YYYY', 'MMMM D, YYYY', 'M DD, YY', 'MM DD, YY',
		        'MMM DD, YY', 'MMMM DD, YY', 'M DD, YYYY', 'MM DD, YYYY', 'MMM DD, YYYY',
		        'MMMM DD, YYYY', 'YY, M D', 'YYYY, M D', 'YY, MM D', 'YY, MMM D', 'YY, MMMM D',
		        'YY, M DD', 'YY, MM DD', 'YY, MMM DD', 'YY, MMMM DD', 'YYYY, M DD', 'YYYY, MM DD',
		        'YYYY, MMM DD', 'YY, MMMM DD', 'YY M D', 'YY MM D', 'YY MMM D', 'YY MMMM D',
		        'YY M DD', 'YY MM DD', 'YY MMM DD', 'YY MMMM DD', 'YYYY M D', 'YYYY MM D',
		        'YYYY MMM D', 'YYYY MMMM D', ' YYYY M DD', 'YYYY MM DD', 'YYYY MMM DD',
		        'YYYY MMMM DD', 'M YY', 'M YYYY', 'MM YY', 'MM YYYY', 'MMM YY', 'MMM YYYY',
		        'MMMM YY', 'MMMM YYYY', 'M, YY', 'MM, YY', 'MMM, YY', 'MMMM, YY', 'M, YYYY',
		        'MM, YYYY', 'MMM, YYYY', 'MMMM, YYYY', 'D M', 'D MM', 'D MMM', 'D MMMM', 'DD M',
						'DD MM', 'DD MMM', 'DD MMMM', 'YY', 'YYYY'
		    ];
				var isoDate = moment(date, dateFormat).format('YYYY-MM-DD');
				return(isoDate.toString().replace('00:00:00', ''));
			}

	getOnChange = () => {
		// have to return a function, because we don't know what evt.target.value is when the this page is rendered (and this function is called)
		return (evt) => {
			var newDate = this.parseDate(evt.target.value);
			this.setState( {setDate: newDate} );
		}
	}

	getOnBlur = () => {
		return (evt) => {
			// Need to call update here. The function to update needs to come through the props
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
