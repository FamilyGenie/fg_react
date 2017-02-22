import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import moment from 'moment';

import EventLineItemEdit from '../peopledetails/event-lineitem-edit';
import { setModalEvent } from '../../actions/modalActions';

@connect(
  (store, ownProps) => {
    return {
      event: ownProps.event,
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
    const { event } = this.props;
    const { modalIsOpen } = this.state;

    const eventDateUser = ( event.eventDateUser ? event.eventDateUser : (event.eventDate ? event.eventDate.substr(0,10) : '') );
    const eventDate = ( event.eventDate ? event.eventDate : (event.eventDate ? event.eventDate.substr(0,10) : '') );


    if (event) {
      return (<div>
        <div class="staged-item">
          <div class="stagedChronDiv">
            <p class="stagedChron">{eventDateUser}</p>
          </div>
          <div class="stagedChronDiv">
            <p class="stagedChron">{event.personFName}&nbsp;{event.personLName}</p>
          </div>
          <div class="stagedChronDiv">
            <p class="stagedChron">{(event.eventType ? event.eventType : "")}</p>
          </div>
          <div class="stagedChronDiv">
            <p class="stagedChron">{(event.eventPlace ? event.eventPlace : "")}</p>
          </div>
          <div class="check-duplicate" onClick={this.openModal}>
						<i class="fa fa-pencil-square-o button2"></i>
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
