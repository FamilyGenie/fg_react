import React from 'react';
import { hashHistory } from 'react-router'
import { createPerson, deletePerson } from '../../actions/peopleActions';
import { connect } from 'react-redux';

import DateInput from '../date-input';

@connect(
	(store, ownProps) => {
	console.log('IN stagedpeopledetailslineitem@CONNECT', store, ownProps);
		return {
      person: ownProps.person,
      lastAdd: store.people.lastAdd 
    };
	},
	(dispatch) => {
		return {
			createPerson: (fName, mName, lName, sexAtBirth, notes) => {
				dispatch(createPerson(fName, mName, lName, sexAtBirth, notes));
			},
			deletePerson: (_id) => {
				dispatch(deletePerson());
			}
		}
	}
)

export default class StagedPeopleSearchLineItem extends React.Component {

	addToRecords = () => {
    // axios call
	}

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
			console.log("In StagedPeopleSearchLineItem updateDate, with: ", field, displayDate, setDate);
		}
	}

	newDate = (date) => {
		try {
			return date.substring(0,10);
		}
		catch(TypeError) {
			return '';
		}
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
					defaultValue="No Name Provided"
          />
			</div>

			<div class="col-xs-2 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.person.lName}

				/>
			</div>

			<div class="col-xs-1 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.person.sexAtBirth}
				/>
			</div>

			<div class="col-xs-2 custom-input">
				<DateInput defaultValue={this.newDate(this.props.person.birthDate)} field="testDate" updateFunction={this.getUpdateDate().bind(this)} />
			</div>

			<div class="col-xs-2 custom-input">
				<DateInput defaultValue={this.newDate(this.props.person.deathDate)} field="testDate" updateFunction={this.getUpdateDate().bind(this)} />
			</div>

			<div class="col-xs-1 custom-input">
				<button
					class="form-control"
					onClick={this.addToRecords}
				>
					Add To DB
				</button>
			</div>

		</div>
	);
}
