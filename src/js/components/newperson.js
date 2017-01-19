import React from 'react';
import { connect } from 'react-redux';

import PeopleDetailsLineItem from './peopledetails/peopledetails-lineitem';
import EventLineItemEdit from './peopledetails/event-lineitem-edit';
import ParentalRelLineItemEdit from './peopledetails/parentalrel-lineitem-edit';
import { updatePerson } from '../actions/peopleActions';
import { updateEvent } from '../actions/eventsActions';
import { updateParentalRel } from '../actions/parentalRelsActions';

/* the following is the code that needs to be inserted into the parent component where you will call this modal to open.
 
  <Modal
        isOpen={modalIsOpen}
        contentLabel="Modal"
        style={modalStyle}
      >
        <NewPerson/>
        <button onClick={this.closeModal}> Close </button>
      </Modal>

*/

@connect(
  (store, ownProps) => {
  console.log('in newPerson@connect with: ', store, ownProps);
    return {
      person: store.people.people.find(function(s) {
        return (store.modal.newPerson.id === s._id)
      }),
      events: store.events.events.filter(function(e) {
        return (e.person_id === store.modal.newPerson.id && e.eventType === 'Birth')
      }),
      parents: store.parentalRels.parentalRels.filter(function(p) {
        return (p.child_id === store.modal.newPerson.id)
      }),
    };
  },
)

export default class NewPerson extends React.Component {
  
  render = () => {

    const { person, events, parents, modalIsOpen } = this.props;

    const mappedEvents = events.map(event =>
    <EventLineItemEdit event={event} key={event._id}/>
    );

    const mappedParents = parents.map(parentalRel =>
    <ParentalRelLineItemEdit parentalRel={parentalRel} key={parentalRel._id}/>
    );

      return(<div>
          <h3> New Person </h3>
          
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
  }
}


