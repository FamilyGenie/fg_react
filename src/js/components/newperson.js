import React from 'react';
import { connect } from 'react-redux';

import PeopleDetailsLineItem from './peopledetails/peopledetails-lineitem';
import EventsLineItem from './peopledetails/event-lineitem';
import ParentalRelLineItem from './peopledetails/parentalrel-lineitem';

@connect(
  (store, ownProps) => {
    console.log('in newperson@connect with: ', store, ownProps)
    return {
      person: store.people.people.find(function(s) {
        return s._id === ownProps.params._id;
      }),
      events: store.events.events.filter(function(e) {
        return e.person_id === ownProps.params._id;
      }),
      parents: store.parentalRels.parentalRels.filter(function(p) {
        return p.child_id === ownProps.params._id;
      }),
    };
  }
)
export default class NewPerson extends React.Component {
  render = () => {

      const { person, events, parents } = this.props;
      console.log('PERSON', person, 'EVENTS', events, 'PARENTS', parents)

      const mappedEvents = events.map(event =>
        <EventsLineItem event={event} key={event._id}/>
      );

      const mappedParentalRels = parents.map(parentalRel =>
        <ParentalRelLineItem parentalRel={parentalRel} key={parentalRel._id}/>
      );

      return (<div>
        <h2> New Person </h2>
        <PeopleDetailsLineItem person={person} key={person._id}/>

        <h2> Events </h2>
        {mappedEvents}

        <h2> Parents </h2>
        {mappedParentalRels}

      </div>)
    }
  }
