import React from 'react';
import { connect } from 'react-redux';

import { updatePerson } from '../../actions/peopleActions';
import EventLineItem from '../peopledetails/event-lineitem';
import MatchedPeopleLineItem from './matched-people-lineitem';

@connect(
  (store, ownProps) => {
    return {
      person: ownProps.person,
      events: store.events.events.filter(function(e) {
        return (e.person_id === ownProps.person._id);
      }),
    };
  },
)

export default class MatchedPeopleDetails extends React.Component {

  getOnBlur = (field) => {
    return (evt) => {
      this.props.onBlur(this.props.person._id, field, evt.target.value);
    }
  }

  render = () => {
    const { person, events, onBlur } = this.props;

    const mappedEvents = events.map(event =>
      <EventLineItem event={event} key={event._id}/>
    );

    if (person) {
      return(<div>

      <MatchedPeopleLineItem person={person} key={person._id} />

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
