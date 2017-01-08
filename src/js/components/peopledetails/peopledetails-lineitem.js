import React from 'react';
import { connect } from "react-redux";

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
export default class PeopleDetailsLineItem extends React.Component {

	getOnBlur = (field) => {
		// have to return a function, because we don't know what evt.target.value is when the this page is rendered (and this function is called)
		return (evt) => {
			console.log(this.props.person._id)
			this.props.onBlur(this.props.person._id, field, evt.target.value);
		}
	}

	deletePerson = () => {
		this.props.deletePerson(this.props.person._id);
	}

	render = () => {
		const { person, onBlur } = this.props;

		// put in code to test if person._id === 0, and then say person cannot be found
		if (person) {
			return (
				<div class="row person-item">
					<div class="col-xs-2 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={person.fName}
							onBlur={this.getOnBlur('fName')}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={person.mName}
							onBlur={this.getOnBlur('mName')}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={person.lName}
							onBlur={this.getOnBlur('lName')}
						/>
					</div>
					<div class="col-xs-1 custom-input">
						<button
							class="form-control"
							onClick={this.deletePerson}
						>
							Delete
						</button>
					</div>
				</div>
			);
		} else {
			return (<p>Loading...</p>);
		}
	}
}
