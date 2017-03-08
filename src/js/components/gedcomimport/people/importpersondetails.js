import React from 'react';
import { connect } from 'react-redux';

import PeopleDetailsLineItem from '../peopledetails/peopledetails-lineitem';
import EventLineItem from '../peopledetails/event-lineitem';
import EventLineItemEdit from '../peopledetails/event-lineitem-edit';
import ParentalRelLineItem from '../peopledetails/parentalrel-line-item';
import ParentalRelLineItemEdit from '../peopledetails/parentalrel-lineitem-edit';

@connect(
  (store, ownProps) => {
    return {
      person: ownProps.person,
      events: store.events.events.filter(function(e) {
        return (e.person_id === ownProps.person._id && e.eventType === 'Birth')
      }),
      parents: store.parentalrels.parentalrels.filter(function(p) {
        return (p.child_id === ownProps.person._id)
      }),
    };
  },
)

export default class ImportPersonDetails extends React.Component {
  
  render = () => {
    const { person, events, parents } = this.pros;

    const mappedEvents = events.map(event =>
    <EventLineItem event={event} key={event._id}/>
    );

    const mappedParents = parents.map(parent =>
    <ParentalRelLineItem parent={parent} key={parent._id}/>
    );

    if (person) {
      return(<div>
        
        <PeopleDetailsLineItem person={person} key={person._id}/>

        <div class="container">
          <h3> Events </h3>
          <div class="col-xs-12">
            {mappedEvents}
          </div>
        </div>
        <div class="container">
          <h3> Parents </h3>
          <div class="col-xs-12">
            {mappedParents}
          </div>
        </div>

      </div>);
    } else {
      return(<p> Loading... </p>);
    }
  }
}



