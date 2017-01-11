import React from 'react';
import { hashHistory } from 'react-router';

import DateInput from '../date-input';

export default class PeopleSearchLineItem extends React.Component {
	openDetails = () => {
		console.log(this.props.person);
		hashHistory.push('/peopledetails/' + this.props.person._id);
	}

	openMap = () => {
		hashHistory.push('/familymap/' + this.props.person._id);
	}

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
		}
	}


	render = () => (
		<div id="person-div">
			<div id="name-date">
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
			</div>
			<div id="details-map">
				<i
					class="fa fa-pencil-square-o"
					onClick={this.openDetails}>
				</i>
				<i
					class="fa fa-sitemap"
					onClick={this.openMap}
				>
			</i>
			</div>
		</div>
	);
}
