import React from 'react';
import { connect } from 'react-redux';

import { updatePerson } from '../actions/peopleActions';
import { updateEvent } from '../actions/eventsActions';
import { updateParentalRel } from '../actions/parentalRelsActions';
import { closeNewPersonModal, deleteNewPerson, saveNewPerson } from '../actions/modalActions';



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
      deleteNewPerson: (_id) => {
        dispatch(deleteNewPerson());
      },
      saveNewPerson: () => {
        dispatch(saveNewPerson());
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

  deleteNewPerson = () => {
    console.log("inside delete new person")
    this.props.deleteNewPerson(this.props.newPerson.id, evt.value);

    if (this.props.closeNewPersonModal) {
      this.props.closeModal();
    }
  }
  savePerson = () => {
    this.props.saveNewPerson(this.props.newPerson.id, evt.value);
    if (this.props.closeNewPersonModal) {
      this.props.closeModal();
    }
  }

  render = () => {

    const { person, events, parents, modalIsOpen } = this.props;

    // events must be mapped to the lineItem, and cannot be passed in individually, not sure why this happens, leaving it for now
    const mappedEvents = events.map(event =>
      <CompactEvent event={event} key={event._id}/>
    )

    const mappedParents = parents.map(parentalRel =>
    <CompactParentalRel parentalRel={parentalRel} key={parentalRel._id}/>
    );


      return(
      <div>
        <div class="modalClose2">
          <i class="fa fa-window-close-o fa-2x" aria-hidden="true" onClick={this.closeModal}></i>
        </div>
        <div class="modalH">
            New Person
        </div>
        <div class="buffer-modal">
        </div>
        <CompactPeopleDetails person={person} key={person._id}/>
          {mappedEvents}
          {mappedParents}
        <div class="event-delete-modal">
					<button
						type="button"
						class="btn btn-default modal-delete"
						onClick={this.savePerson}
					>
						Save
					</button>
					<button
						type="button"
						class="btn btn-default modal-delete"
						onClick={this.deleteNewPerson}
					>
						Cancel
					</button>
				</div>
      </div>);
  }
}
