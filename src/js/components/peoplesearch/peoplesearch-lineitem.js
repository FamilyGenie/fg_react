import React from 'react';
import { hashHistory } from 'react-router'

export default class PeopleSearchLineItem extends React.Component {
	openDetails = () => {
		hashHistory.push('/peopledetails/' + this.props.person._id);
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
			<div class="col-xs-1 custom-input">
				<button
					class="form-control"
					onClick={this.openDetails}
				>
					Details
				</button>
			</div>
		</div>
	);
}
