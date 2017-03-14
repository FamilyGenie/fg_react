import React from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';

import DateInput from '../date-input';

@connect(
  (store, ownProps) => {
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

	render = () => {

    const { person } = this.props;

    return (
      <div id="person-div">
        <div id="name-date">
          <div class="custom-input">
            <p class="person-text">
              {person.fName}
            </p>
            <p class="person-text">
              {person.mName}
            </p>
            <p class="person-text">
              {person.lName}
            </p>
          </div>
          <div class="date-div">
            <p class="person-text">
              {person.eventDateUser}
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
    )
	};
}
