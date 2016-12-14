import React from 'react';
import { connect } from "react-redux";

import { updatePerson } from '../../actions/peopleActions';

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
			}
		}
	}
)
export default class PeopleDetails extends React.Component {
	
	getOnBlur = (field) => {
		return (evt) => {
			this.props.onBlur(this.props.person._id, field, evt.target.value)
		}
	}

	render = () => {
		console.log("in PeopleDetails with: ", this.props);
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
						/>
					</div>
				</div>
			);
		} else {
			return (<p>Loading...</p>);
		}
	}
}