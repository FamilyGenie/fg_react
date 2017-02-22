import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import moment from 'moment';

import DateInput from '../date-input';

@connect(
	(store, ownProps) => {

		return {
			stagedPerson: ownProps.stagedPerson,
		}
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



		return(
		<div class="staged-item">
			<div class="staged-name-div">
				<p class="staged-name">{stagedPerson.fName}</p>
				<p class="staged-name">{stagedPerson.lName}</p>
			</div>
			<div class="staged-sex">
				<p class="staged-name">{stagedPerson.sexAtBirth}</p>
			</div>
			<div class="staged-date">
				<p class="staged-name">{bDate}</p>
			</div>
			<div class="staged-date">
				<p class="staged-name">{dDate}</p>
			</div>
			<div class="check-duplicate">
				<i class="fa fa-users fa-2x button2" aria-hidden="true" onClick={this.openDetails}></i>
			</div>
		</div>
	);
	}
}
