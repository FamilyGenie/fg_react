import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import moment from 'moment';

import EventLineItemEdit from '../peopledetails/event-lineitem-edit';
import { setModalEvent } from '../../actions/modalActions';

@connect(
  (store, ownProps) => {
    var event = store.events.events.find(function(e) {
        return e._id === ownProps.eventId;
    });

    return {
      event : event,
      person : store.people.people.find(function(p) {
        return event.person_id === p._id
      }),
    }
  },
  (dispatch) => {
    return {
      setEvent: (event) => {
        dispatch(setModalEvent(event));
      },
    }
  }
)
export default class ChronologyLineItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  openModal = () => {
    // As well as setting the variable for the modal to open, pass the event that we want to show up in the modal window to the Store. The EventLineItemEdit component that shows in the modal will grab the event from the store.
    this.props.setEvent(this.props.event);
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  render = () => {
    const { person, event } = this.props;
    const { modalIsOpen } = this.state;

    const eventDateUser = ( event.eventDateUser ? event.eventDateUser : (event.eventDate? event.eventDate.substr(0,10) : '') );
    const eventDate = ( event.eventDate ? event.eventDate : (event.eventDate? event.eventDate.substr(0,10) : '') );


    if (event) {
      return (<div>
        <div class="staged-item">
					<div class="buttonCol col-xs-1" onClick={this.openModal}>
						<i class="fa fa-pencil-square-o"></i>
					</div>
          <div class="nameCol col-xs-2">
            {eventDateUser}
          </div>
          <div class="nameCol col-xs-3">
            {(person ? person.fName + ' ' + person.lName : "")}
          </div>
          <div class="nameCol col-xs-2">
            {(event.eventType ? event.eventType : "")}
          </div>
          <div class="nameCol col-xs-2">
            {(event.eventPlace ? event.eventPlace : "")}
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          contentLabel="Modal"
        >
          <div class="row">
            <div class="col-xs-12">
              Event Edit
            </div>
          </div>
          <EventLineItemEdit event={event} star={event.person_id}/>
          <div><p></p></div>
          <button onClick={this.closeModal}>Close</button>
        </Modal>

      </div>)
    } else {
      return (<p>Loading...</p>);
    }
  }
}
