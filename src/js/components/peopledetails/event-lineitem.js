import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';

import EventLineItemEdit from './event-lineitem-edit';
import { setModalEvent, resetModalEvent } from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		// Since we are passing the person in from the parent object, just map the component's props to the props that have come in (for now).
		return ownProps;
	},
	(dispatch) => {
		return {
			// get the parentalRel object that needs to appear in the modal
			setEvent: (event) => {
				dispatch(setModalEvent(event));
			},
			resetEvent: () => {
				dispatch(resetModalEvent());
			},
		}
	}
)
export default class EventLineItem extends React.Component {
	constructor (props) {
		super(props);
		// this variable will store whether the modal window is open or not
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
		const { event } = this.props;
		const { modalIsOpen } = this.state;

    // check for an event date entered by the user, if there is not one, use the date from the database, if no event from db, display 'click to edit'
		const eventDateUser = ( event.eventDateUser ? event.eventDateUser : (event.eventDate ? event.eventDate.substr(0,10) : "Click to Edit") );

		if (event) {
			return (
				<div class="chronology-row">
					<div class="buttonCol" onClick={this.openModal}>
						<i class="fa fa-pencil-square-o chronology-edit"></i>
					</div>
					<div class="inner-event-name">
						<div class="nameCol" onClick={this.openModal}>
							<div class="relTypeWord">{eventDateUser}</div>
						</div>
						<div class="relTypeCol">
							<div class="relTypeWord ital">{event.eventType}
							</div>
							<div class="relTypeWord ital">{event.eventPlace}</div>
						</div>
					</div>
					{/* This modal is what opens when you click on one of the event records that is displayed. The modalIsOpen variable is accessed via the state, by the openModal call (and set to false in the closeModal call). When set, the new state triggers a re-rendering, and the isOpen property of the modal is then true, so it displays. We also store the event record that should be opened in the modal in the Store, so it can be accessed */}
					<Modal
						className="detail-modal"
						isOpen={modalIsOpen}
						contentLabel="Modal"
						>
						{/* Everything between here and <EventLineItemEdit/> is the header of the modal that will open to edit the parental relationship info */}
						<div class="modal-header">
							<div class="modal-header-1">
							</div>
							<div class="modal-header-2">
								<div class="PR-modal-header">
									Event Edit
								</div>
							</div>
							<div class="modal-header-3">
								<i class="fa fa-window-close-o fa-2x" aria-hidden="true" onClick={this.closeModal}></i>
							</div>
						</div>
						<div class="buffer-modal">
						</div>
						<EventLineItemEdit event={event} star={event.person_id}/>
					</Modal>
				</div>)
		} else {
			return (<p>Loading Events...</p>);
		}
	}
}
