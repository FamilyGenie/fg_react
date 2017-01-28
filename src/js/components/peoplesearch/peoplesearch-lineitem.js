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
		hashHistory.push('/peopledetails/' + this.props.person._id);
	}

	openMap = () => {
    hashHistory.push('/familymap/' + this.props.person._id);
	}

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
		}
	}

  // this function needs to be run here for the birthdate to populate properly. Cannot be done in the props or it will return undefined, and break the page.
  birthDate = () => {
    try {
      return this.props.event.eventDate.toString().substr(0,10).toLowerCase(); // not sure if we want to do toLowerCase()... TODO
    } catch (TypeError) {
      return "no birthDate"
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
					<p class="person-text">
            {this.birthDate()}
          </p>
				</div>
			</div>
			<div id="details-map">
				<i
					class="fa fa-pencil-square-o button2"
					onClick={this.openDetails}>
				</i>
				<i
					class="fa fa-sitemap button2"
					onClick={this.openMap}
				>
			</i>
			</div>
		</div>
	);
}
