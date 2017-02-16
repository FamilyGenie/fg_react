import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import moment from 'moment';

import DateInput from '../date-input';

@connect(
	(store, ownProps) => {
		return ownProps;
	},
)

export default class StagedPeopleSearchLineItem extends React.Component {
	openDetails = () => {
		hashHistory.push('/stagedpeopledetails/' + this.props.stagedPerson._id);
	}

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
		}
	}

	newDate = (date) => {
		try {
			var nDate = moment(date).format('MMM DD YYYY');
			if (nDate === 'Invalid date') {
				nDate = '';
			}
			return nDate
		}
		catch(TypeError) {
			return '';
		}
	}

	render = () => {
		const {stagedPerson} = this.props;
		const bDate = (stagedPerson.birthDate ? stagedPerson.birthDate.substr(0,10) : stagedPerson.birthDate);
		const dDate = (stagedPerson.deathDate ? stagedPerson.deathDate.substr(0,10) : stagedPerson.deathDate);

    return (<div>
			<div class="col-xs-2 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.stagedPerson.fName}
				/>
			</div>

			<div class="col-xs-2 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.stagedPerson.lName}
				/>
			</div>

			<div class="col-xs-1 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.stagedPerson.sexAtBirth}
				/>
			</div>

			<div class="col-xs-2 custom-input">
				<DateInput defaultValue={this.newDate(this.props.stagedPerson.birthDate)} field="testDate" updateFunction={this.getUpdateDate().bind(this)} />
			</div>

			<div class="col-xs-2 custom-input">
				<DateInput defaultValue={this.newDate(this.props.stagedPerson.deathDate)} field="testDate" updateFunction={this.getUpdateDate().bind(this)} />
			</div>

			<div class="col-xs-1 custom-input">
				<button
					class="form-control"
					onClick={this.openDetails}
				>
					Details
				</button>
			</div>


    </div>);
  }
}
