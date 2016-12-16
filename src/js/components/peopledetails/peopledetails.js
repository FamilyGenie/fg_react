import React from 'react';
import { connect } from "react-redux";

import { createPerson, deletePerson, updatePerson } from '../../actions/peopleActions';

@connect(
	(store, ownProps) => {
		return {
			person:
				store.people.people.find(function(p) {
					return p._id === ownProps.params._id;
				})
		};
	},
	(dispatch) => {
		return {
			onBlur: (_id, field, value) => {
				dispatch(updatePerson(_id, field, value));
			},
			deletePerson: (_id) => {
				dispatch(deletePerson(_id));
			},
			createPerson: () => {
				console.log("in dispatch.createPerson");
				dispatch(createPerson());
			}

		}
	}
)
export default class PeopleDetails extends React.Component {

	getOnBlur = (field) => {
		// have to return a function, because we don't know what evt.target.value is when the this page is rendered (and this function is called)
		return (evt) => {
			this.props.onBlur(this.props.person._id, field, evt.target.value)
		}
	}

	deletePerson = () => {
		this.props.deletePerson(this.props.person._id);
	}

	createPerson = () => {
		this.props.createPerson();
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
					<div class="col-xs-1 custom-input">
						<button
							class="form-control"
							onClick={this.deletePerson}
						>
							Delete
						</button>
					</div>
					<div class="col-xs-2 custom-input">
						<button
							class="form-control"
							onClick={this.createPerson}
						>
							Create New
						</button>
					</div>
				</div>
			);
		} else {
			return (<p>Loading...</p>);
		}
	}
}
