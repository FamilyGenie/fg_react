import React from 'react';
import { hashHistory } from 'react-router'

import DateInput from '../date-input';

export default class StagedPeopleSearchLineItem extends React.Component {
	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
			console.log("In StagedPeopleSearchLineItem updateDate, with: ", field, displayDate, setDate);
		}
	}

	newDate = (date) => {
		try {
			return date.substring(0,10);
		}
		catch(TypeError) {
			return '';
		}
	}

	render = () => (

		<div class="row person-item">

			<div class="col-xs-2 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.person.fName}
				/>
			</div>

			<div class="col-xs-2 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.person.lName}
				/>
			</div>

			<div class="col-xs-1 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.person.sexAtBirth}
				/>
			</div>

			<div class="col-xs-2 custom-input">
				<DateInput defaultValue={this.newDate(this.props.person.birthDate)} field="testDate" updateFunction={this.getUpdateDate().bind(this)} />
			</div>

			<div class="col-xs-2 custom-input">
				<DateInput defaultValue={this.newDate(this.props.person.deathDate)} field="testDate" updateFunction={this.getUpdateDate().bind(this)} />
			</div>

		</div>
	);
}
