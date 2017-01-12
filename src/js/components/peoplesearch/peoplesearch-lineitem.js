import React from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';

import DateInput from '../date-input';

@connect(
  (store, ownProps) => {
    // console.log('in peoplesearch-lineitem@connect with: ', store, ownProps)
    return {
      event: store.events.events.find(function(e) {
        return (e.person_id === ownProps.person._id);
      }),
    }
  }
)
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

  birthDate = () => {
    try {
      return this.props.event.eventDate.toString().substr(0,10)
    } catch (TypeError) {
      return "no birthDate"
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
			<div class="col-xs-2 custom-input">
				<input
					class="form-control"
					type="text"
					defaultValue={this.props.person.lName}
				/>
			</div>
			<div class="col-xs-2 custom-input">
        {this.birthDate()}
      </div>
			<div class="details-button">
				<button
					class="form-control detail"
					onClick={this.openDetails}>
					Details
				</button>
				<button
					class="form-control"
					onClick={this.openMap}
				>
					Map
				</button>
			</div>
		</div>
	);
}
