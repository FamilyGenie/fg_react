import React from 'react';
import { connect } from 'react-redux';

import PeopleDetailsLineItem from './peopledetails/peopledetails-lineitem';
import EventLineItemEdit from './peopledetails/event-lineitem-edit';
import ParentalRelLineItemEdit from './peopledetails/parentalrel-lineitem-edit';
import { updatePerson } from '../actions/peopleActions';
import { updateEvent } from '../actions/eventsActions';
import { updateParentalRel } from '../actions/parentalRelsActions';
import { closeNewPersonModal } from '../actions/modalActions';

/* the following is the code that needs to be inserted into the parent component render method where you will call this modal to open.
You can look in the peoplesearch component for an example of a component that calls this component

  <Modal
        isOpen={modalIsOpen}
        contentLabel="Modal"
        style={modalStyle}
      >
        <NewPerson/>
      </Modal>

*/

@connect(
  (store, ownProps) => {
    return {
      person: store.people.people.find(function(s) {
        return (store.modal.newPerson.id === s._id)
      }),
      events: store.events.events.filter(function(e) { // doing a find returns a single object, instead of an array, which cannot be mapped to the lineItem
        return (e.person_id === store.modal.newPerson.id && e.eventType === 'Birth')
      }),
      parents: store.parentalRels.parentalRels.filter(function(p) {
        return (p.child_id === store.modal.newPerson.id)
      }),
      modalIsOpen: store.modal.newPerson.modalIsOpen,
    };
  },
  (dispatch) => {
    return {
      closeNewPersonModal: () => {
        dispatch(closeNewPersonModal());
      },
    }
  }
)

export default class NewPerson extends React.Component {

  closeModal = () => {
    // This is validation for the contents of the modal. The user must either delete the person or enter the required information.
    if (!this.props.events[0].eventDate) { // the first record should be the newly created Birth record, might need some validation here.
      msg.show('Need to enter a valid birth date', {
        type: 'error'
      });
    } else if (!this.props.person.fName) {
      msg.show('Need to enter a valid first name', {
        type: 'error'
      })
    } else {
      this.props.closeNewPersonModal();
    }
  }

  render = () => {

    const { person, events, parents, modalIsOpen } = this.props;

    // events must be mapped to the lineItem, and cannot be passed in individually, not sure why this happens, leaving it for now
    const mappedEvents = events.map(event =>
      <EventLineItemEdit event={event} key={event._id}/>
    )

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
          <button onClick={this.closeModal}> Close </button>
      </div>);
  }
}


