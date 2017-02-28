import React from 'react';
import { connect } from "react-redux";
import { hashHistory } from 'react-router';

import { createPerson, deletePerson, updatePerson } from '../../actions/peopleActions';

@connect(
	(store, ownProps) => {
		// Since we are passing the person in from the parent object, just map the component's props to the props that have come in (for now). However, soon, we will add the parentrelationships, pairbondrelationships, and events into the props (maybe)
		return ownProps;
	},
	(dispatch) => {
		return {
			onBlur: (_id, field, value) => {
				dispatch(updatePerson(_id, field, value));
			},
			deletePerson: (_id) => {
				dispatch(deletePerson(_id));
			},
		}
	}
)
export default class CompactPeopleDetails extends React.Component {

	getOnBlur = (field) => {
		// have to return a function, because we don't know what evt.target.value is when the this page is rendered (and this function is called)
		return (evt) => {
			this.props.onBlur(this.props.person._id, field, evt.target.value);
		}
	}

	deletePerson = () => {
		this.props.deletePerson(this.props.person._id);
		hashHistory.push('/');
	}

	openMap = () => {
		hashHistory.push('/familymap/' + this.props.person._id);
	}



	render = () => {
		const { person, onBlur } = this.props;

		// put in code to test if person._id === 0, and then say person cannot be found
		if (person) {
			return (
			<div class="compactPerson">
				<div class="personDetails">
					<div class="pDetail">
						<input
							class="form-control detail-input"
							type="text"
							value={person.fName}
							placeholder="Enter First Name"
							onChange={this.getOnBlur('fName')}
						/>
						<input
							class="form-control detail-input"
							type="text"
							value={person.mName}
							placeholder="Enter Middle Name"
							onChange={this.getOnBlur('mName')}
						/>
				</div>
				<div class="pDetail">
					<input
						class="form-control detail-input"
						type="text"
						value={person.lName}
						placeholder="Enter Last Name"
						onChange={this.getOnBlur('lName')}
					/>
					<input
						class="form-control detail-input"
						type="text"
						defaultValue={person.sexAtBirth}
						placeholder="Enter Gender At Birth"
						onChange={this.getOnBlur('sexAtBirth')}
					/>
				</div>
			</div>
			<div class="buffer-modal">
			</div>
		</div>
			);
		} else {
			return (<p>Loading...</p>);
		}
	}
}
