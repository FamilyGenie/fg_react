import React from 'react';
import { hashHistory } from 'react-router'

import DateInput from '../date-input';

export default class PeopleSearchLineItem extends React.Component {
	openDetails = () => {
		console.log(this.props.person);
		hashHistory.push('/peopledetails/' + this.props.person._id);
	}

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
			console.log("In PeopleSearchLineItem updateDate, with: ", field, displayDate, setDate);
		}
	}


	render = () => (
		<div id="person-div">
			<div class="custom-input">
				<p class="person-text">
					{this.props.person.fName}
				</p>
				<p class="person-text">
					{this.props.person.mName}
				</p>
				<p class="person-text">
					{this.props.person.lName}
				</p>
			</div>
			<div class="date-div">
				<p class="person-text">Added: 12/31/1971</p>
			</div>
			<div class="details-button">
				<button
					class="form-control detail"
					onClick={this.openDetails}>
					Details
				</button>
			</div>
		</div>
	);
}
