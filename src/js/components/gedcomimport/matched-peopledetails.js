import React from 'react';
import { connect } from 'react-redux';

import { updatePerson } from '../../actions/peopleActions';
import { updateStagedPerson } from '../../actions/stagedPeopleActions';
import EventLineItem from '../peopledetails/event-lineitem';
import MatchedPeopleLineItem from './matched-people-lineitem';

@connect(
  (store, ownProps) => {
    console.log("in matchedpeopledetails@connect with: ", ownProps)
    return {
      starId : ownProps.starId,
      person: ownProps.person,
      events: store.events.events.filter(function(e) {
        return (e.person_id === ownProps.person._id);
      }),
    };
  },
  (dispatch) => {
    return {
      useRecord: (_id, field, value) => {
        dispatch(updateStagedPerson(_id, field, value));
      }
    }
  }
)

export default class MatchedPeopleDetails extends React.Component {

  useRecord = () => {
    this.props.useRecord(this.props.starId, 'genie_id', this.props.person._id);
    this.props.useRecord(this.props.starId, 'ignore', true);
  }

  render = () => {
    const { person, events, onBlur } = this.props;

    const mappedEvents = events.map(event =>
      <EventLineItem event={event} key={event._id}/>
    );

    if (person) {
      return(<div>

      <MatchedPeopleLineItem person={person} key={person._id} />

      <button onClick={this.useRecord}>
        Use Record
      </button>

        <div class="container">
          <h3> Events </h3>
          <div class="col-xs-12">
            {mappedEvents}
          </div>
        </div>

      </div>);
    } else {
      return (<p>Loading...</p>);
    }
  }
}
