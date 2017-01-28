import React from 'react';
import { hashHistory } from 'react-router'
import { connect } from 'react-redux';

import { importPerson } from '../../actions/importActions';
import DateInput from '../date-input';

@connect(
	(store, ownProps) => {
		return {
      person: ownProps.person,
    };
	},
	(dispatch) => {
		return {
      importPerson: (fName, mName, lName, sexAtBirth, birthDate, birthPlace, deathDate, deathPlace, notes, _id) => {
        dispatch(importPerson(fName, mName, lName, sexAtBirth, birthDate, birthPlace, deathDate, deathPlace, notes, _id));
      },
		}
	}
)

export default class StagedPeopleDetailsLineItem extends React.Component {

  importPerson = () => {
    this.props.importPerson(this.props.person.fName,this.props.person.mName,this.props.person.lName,this.props.person.sexAtBirth,this.props.person.birthDate,this.props.person.birthPlace,this.props.person.deathDate,this.props.person.deathPlace,this.props.person.notes, this.props.person._id);
    alert('You hae imported a new record for ' + this.props.person.fName + ' ' + this.props.person.lName)
    hashHistory.push('/stagedpeoplesearch/');
  }

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
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
        <div>
					{this.props.person.fName}
        </div>
			</div>

			<div class="col-xs-2 custom-input">
        <div>
					{this.props.person.lName}
        </div>
			</div>

			<div class="col-xs-1 custom-input">
        <div>
					{this.props.person.sexAtBirth}
        </div>
			</div>

			<div class="col-xs-2 custom-input">
        <div>
          {this.props.person.birthDate ? this.props.person.birthDate.toString().substr(0,10) : ''}
        </div>
			</div>

			<div class="col-xs-2 custom-input">
        <div>
          {(this.props.person.deathDate ? this.props.person.deathDate.toString().substr(0,10) : '')}
        </div>
			</div>

			<div class="col-xs-3 custom-input">
				<button
					class="form-control"
					onClick={this.importPerson}
				>
					Add To DB
				</button>
			</div>

		</div>
	);
}
