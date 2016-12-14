import React from 'react';
import { connect } from "react-redux";

import { updatePerson } from '../../actions/peopleActions';

@connect(
	(store, ownProps) => {
		console.log("in connect, with: ", ownProps);
		return {
			person: 
				store.people.people.find(function(p) {
					// return p._id === '57c2f3bdb9f81e5b42bc2756'
					return p._id === ownProps.params._id;
				}) 
		};
	}, 
	(dispatch) => {
		return {
			onChange: (_id, field, value) => {
				dispatch(updatePerson(_id, field, value));
			}
		}
	}
)
export default class PeopleDetails extends React.Component {
	
	getOnChange = (field) => {
		console.log("in PeopleDetails.getOnChange");
		return (evt) => {
			this.props.onChange(this.props.person._id, field, evt.target.value)
		}
	}

	render = () => {
		console.log("in PeopleDetails with: ", this.props);
		const { person, onChange } = this.props;

		// put in code to test if person._id === 0, and then say person cannot be found
		if (person) {
			// console.log("In PeopleDetails, with id: ", person._id);
			//return (<p>People Details</p>);
			return (
				<div class="row person-item">
					<div class="col-xs-2 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={person.fName}
							onChange={this.getOnChange('fName')}
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