import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import EventLineItemEdit from '../peopledetails/event-lineitem-edit';
import { setEvent } from '../../actions/modalActions';

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
        dispatch(setEvent(event));
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

    const eventDateUser = ( event.eventDateUser ? event.eventDateUser : (event.eventDate? event.eventDate.substr(0,10) : "DATE") );

		var modalStyle = {
			overlay: {
			position: 'fixed',
			top: 100,
			left: 100,
			right: 100,
			bottom: 100,
			}
		}
		var headingStyle = {
			textAlign: "center",
			color: "#333333",
			fontWeight: "bold",
			fontSize: "1.25em",
			marginBottom: 10,
		}

    if (event) {
      return (<div>
        <div class="infoRow">
					<div class="buttonCol" onClick={this.openModal}>
						<i class="fa fa-pencil-square-o"></i>
					</div>
          <div class="nameCol">
            {eventDateUser}
          </div>
          <div class="nameCol">
            {(event.eventType ? event.eventType : "EVENT TYPE")}
          </div>
          <div class="nameCol">
            {(event.eventPlace ? event.eventPlace : "EVENT PLACE")}
          </div>
          <div class="nameCol">
            {(person ? person.fName + ' ' + person.lName : "PERSON")}
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          contentLabel="Modal"
          style={modalStyle}
        >
          <div class="row">
            <div class="col-xs-12" style={headingStyle}>
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
