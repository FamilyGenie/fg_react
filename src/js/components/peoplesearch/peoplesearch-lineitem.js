import React from 'react';
import { hashHistory } from 'react-router'

import DateInput from '../date-input';

export default class PeopleSearchLineItem extends React.Component {
	openDetails = () => {
		hashHistory.push('/peopledetails/' + this.props.person._id);
	}

	openMap = () => {
		hashHistory.push('/familymap/' + this.props.person._id);
	}

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
			console.log("In PeopleSearchLineItem updateDate, with: ", field, displayDate, setDate);
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
					defaultValue={this.props.person.mName}
				/>
			</div>
			<div class="col-xs-2 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.person.lName}
				/>
			</div>
			<div class="col-xs-2 custom-input">
				<DateInput defaultValue='12/31/1970' field="testDate" updateFunction={this.getUpdateDate().bind(this)} />
			</div>
			<div class="col-xs-1 custom-input">
				<button
					class="form-control"
					onClick={this.openDetails}
				>
					Details
				</button>
				<button
					class="form-control"
					onClick={this.openMap}
				>
					Map
				</button>
			</div>
		</div>
	);
}
