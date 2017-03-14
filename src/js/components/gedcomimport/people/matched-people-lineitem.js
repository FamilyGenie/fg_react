import React from 'react';
import { connect } from 'react-redux';

import { updatePerson } from '../../../actions/peopleActions';

@connect(
  (store, ownProps) => {
    return {
      person: ownProps.person,
      events: store.events,
      people: store.people
    };
  },
  (dispatch) => {
    return {
      onBlur: (_id, field, value) => {
        dispatch(updatePerson(_id, field, value));
      },
    }
  }
)

export default class MatchedPeopleDetailsLineItem extends React.Component {

  getOnBlur = (field) => {
    return (evt) => {
      this.props.onBlur(this.props.person._id, field, evt.target.value);
    }
  }
  useRecord = () => {
    this.props.useRecord();
  }

  render = () => {
    const { person, events, onBlur } = this.props;

    if (person) {
      return(
        <div class="stagedPerson">
          <div class="comparisonNameDiv">
            <p class="staged-name">{this.props.person.fName}</p>
            <p class="staged-name">{this.props.person.mName}</p>
            <p class="staged-name">{this.props.person.lName}</p>
          </div>
          <div class="staged-sex">
    				<p class="staged-name">{this.props.person.sexAtBirth}</p>
          </div>
          <div class="stagedButton">
    				<button
    					class="btn button3"
    					onClick={this.useRecord}
    				>
    					Use
    				</button>
    			</div>
        </div>);
    } else {
      return (<p>Loading...</p>);
    }
  }
}
