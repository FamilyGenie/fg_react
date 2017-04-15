import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import moment from 'moment';

import EventLineItemEdit from '../peopledetails/event-lineitem-edit';
import { setModalEvent, resetModalEvent } from '../../actions/modalActions';

@connect(
  (store, ownProps) => {
    return {
      event: ownProps.event,
      // the color needs to be passed in here or the style will not take effect
      color: ownProps.color,
      colorFuncs: ownProps.colorFuncs,
    }
  },
  (dispatch) => {
    return {
      setEvent: (event) => {
        dispatch(setModalEvent(event));
      },
			resetEvent: () => {
				dispatch(resetModalEvent());
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
		// first call the action that will set the store.modal.event to empty string, so that the event currently set for the EventLineItemEdit is not accidentally opened the next time this modal is opened.
		this.props.resetEvent();
    this.setState({modalIsOpen: false});
  }

  render = () => {
    const { event, color, colorFuncs } = this.props;
    const { modalIsOpen } = this.state;

    const eventDateUser = ( event.eventDateUser ? event.eventDateUser : (event.eventDate ? event.eventDate.substr(0,10) : '') );
    const eventDate = ( event.eventDate ? event.eventDate : (event.eventDate ? event.eventDate.substr(0,10) : '') );


    if (event) {

      let mystyle;
      try {
        mystyle = {backgroundColor : color};
      } catch (TypeError) {}


      return (<div>
        <div class="staged-item" style={mystyle}>
          <div style={{height:10+'px', width:10+'px', backgroundColor:'black'}} onClick={() => {colorFuncs.colorEvents(event.person_id)}}></div>
          <div style={{height:10+'px', width:10+'px', backgroundColor:'blue'}} onClick={() => {colorFuncs.paternalEvents(event.person_id)}}></div>
          <div style={{height:10+'px', width:10+'px', backgroundColor:'red'}} onClick={() => {colorFuncs.maternalEvents(event.person_id)}}></div>
          <div class="stagedChronDate">
            <p class="stagedChron">{eventDateUser}</p>
          </div>
          <div class="stagedChronPerson">
            <p class="stagedChron">{event.personFName}&nbsp;{event.personLName}</p>
          </div>
          <div class="stagedChronType">
            <p class="stagedChron2">{(event.eventType ? event.eventType : "")}</p>
          </div>
          <div class="stagedChronPlace">
            <p class="stagedChron3">{(event.eventPlace ? event.eventPlace : "")}</p>
          </div>
          <div class="check-duplicate" onClick={this.openModal}>
						<i class="fa fa-pencil-square-o button2 pencil2"></i>
					</div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          contentLabel="Modal"
        >
          <div class="modalClose">
            <i class="fa fa-window-close-o fa-2x" aria-hidden="true" onClick={this.closeModal}></i>
          </div>
          <div class="modalH">
              Event Edit
          </div>
          <div class="buffer-modal"></div>
          <EventLineItemEdit event={event} star={event.person_id} closeModal={this.closeModal}/>
          <div><p></p></div>
        </Modal>

      </div>)
    } else {
      return (<p>Loading...</p>);
    }
  }
}
