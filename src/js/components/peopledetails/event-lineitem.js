import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';

import EventLineItemEdit from './event-lineitem-edit';
import { setEvent } from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		// Since we are passing the person in from the parent object, just map the component's props to the props that have come in (for now).
		return ownProps;
	},
	(dispatch) => {
		return {
			// get the parentalRel object that needs to appear in the modal
			setEvent: (event) => {
				dispatch(setEvent(event));
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
		this.setState({modalIsOpen: false});
	}

	render = () => {
		const { event } = this.props;
		const { modalIsOpen } = this.state;

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

    // check for an event date entered by the user, if there is not one, use the date from the database, if no event from db, display 'click to edit'
		const eventDateUser = ( event.eventDateUser ? event.eventDateUser : (event.eventDate ? event.eventDate.substr(0,10) : "Click to Edit") );

		if (event) {
			return (
				<div class="infoRow">
					<div class="buttonCol" onClick={this.openModal}>
						<i class="fa fa-pencil-square-o"></i>
					</div>
					<div class="nameCol" onClick={this.openModal}>
							{eventDateUser}
					</div>
					<div class="nameCol">
						{event.eventType}
					</div>
					<div class="nameCol">
						{event.eventPlace}
					</div>
					{/* This modal is what opens when you click on one of the event records that is displayed. The modalIsOpen variable is accessed via the state, by the openModal call (and set to false in the closeModal call). When set, the new state triggers a re-rendering, and the isOpen property of the modal is then true, so it displays. We also store the event record that should be opened in the modal in the Store, so it can be accessed */}
					<Modal
						isOpen={modalIsOpen}
						contentLabel="Modal"
						style={modalStyle}
						>
						{/* Everything between here and <EventLineItemEdit/> is the header of the modal that will open to edit the parental relationship info */}
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
			return (<p>Loading Events...</p>);
		}
	}
}
