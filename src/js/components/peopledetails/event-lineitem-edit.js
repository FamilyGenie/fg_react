import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import DateInput from '../date-input';
import { updateEvent, deleteEvent } from '../../actions/eventsActions';
import { resetModalEvent } from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		// for the modal to work, we previously put the event in store (in the modal object). Passing the parameter from the parent component always results in the last parent showing up in the modal.
		// When we close the modal, there is no event object in the store, so check for that condition. If there is no event object found in the store, then just send through ownProps
		if (store.modal.event) {
			return {
				...ownProps,
				event:
					store.modal.event,
				eventTypes:
					store.eventTypes.eventTypes,
				star:
					store.modal.event.person_id,
			}
		} else {
      return {
        event:
          ownProps.event,
        eventTypes:
          store.eventTypes.eventTypes,
      }
		}
	},
	(dispatch) => {
		return {
			updateEvent: (_id, field, value) => {
				console.log("in update event: ", _id, field, value);
				dispatch(updateEvent(_id, field, value));
			},
			deleteEvent: (_id) => {
				// this action requires a feild and a value to delete
				dispatch(deleteEvent('_id', _id));
			},
			resetModalEvent: () => {
				dispatch(resetModalEvent());
			},
		}
	}
)
export default class EventLineItemEdit extends React.Component {
constructor(props) {
	super(props);
	console.log("in EventLineItemEdit with: ", this.props);

	// this.state.relType stores the value for the relationshipType dropdown. Per the online forums, this is how you tell react-select what value to display (https://github.com/JedWatson/react-select/issues/796)
	this.state = {
		// while in transition to using startDates and startDateUsers (and endDates and endDateUsers), if the User entered field does not yet exist, populate it with the startDate or endDate field. Eventually all records will have the 'User' fields and this code can be changed by removing the condition and just setting the field to the value from this.props.pairBondRel

		eventDateNew: this.props.event.eventDate,
		eventDateUserNew: this.props.event.eventDateUser,

		eventTypeNew: this.props.event.eventType,
		eventTypeUserNew: this.props.event.eventTypeUser,

		eventPlaceNew: (this.props.event.eventPlace ? this.props.event.eventPlace : " "),

		eventPlaceUserNew: (this.props.event.eventPlace ? this.props.event.eventPlace : " "),

		familyContextNew: this.props.event.familyContext,
		familyContextUserNew: this.props.event.familyContextUser,

		localContextNew: this.props.event.localContext,
		localContextUserNew: this.props.event.localContextUser,

		worldContextNew: this.props.event.worldContext,
		worldContextUserNew: this.props.event.worldContextUser,
	};
}

	// onEventTypeChange = (evt) => {
	// 	this.props.updateEvent(this.props.event._id, "eventType", evt.value);
	// 	// As well as updating the database and the store, update the state variable so the display shows the new value.
	// 	this.setState({eventType: evt.value});
	// }

	// this call returns a function, so that when the field is updated, the fuction will execute.
	getUpdateDate = (field, dateUser, dateSet) => {
		// this is the function that will fire when the field is updated. first, it updates the data store. Then, it updates the appropriate field in the state, so that a display re-render is triggered
		return (field, dateUser, dateSet) => {
			this.props.updateEvent(this.props.event._id, field, dateSet);
			this.props.updateEvent(this.props.event._id, field + "User", dateUser);
			this.setState({startDateUser: dateUser});
		}
	}

	getUpdateEvent = (field) => {
		// have to return a function, because we don't know what evt.target.value is when the this page is rendered (and this function is called)
		return (evt) => {
			this.props.updateEvent(this.props.event._id, field, evt.target.value);
		}
	}

<<<<<<< HEAD
	tempEventDate = (parsedDate, userDate) => {
		this.setState({
			eventDateUserNew: userDate,
			eventDateNew: parsedDate
		});
		console.log(this.state, "inside eventDate");
	}
	tempEventType = (evt) => {
		this.setState({eventTypeUserNew: evt.value});
		console.log(this.state, "inside eventType");
	}
	tempEventPlace = (evt) => {
		this.setState({eventPlaceUserNew: evt.value});
		// console.log(this.state, "inside eventPlace");
	}
	tempFamilyContext = (evt) => {
		this.setState({familyContextUserNew: evt.value});
		// console.log(this.state, "inside family");
	}
	tempLocalContext = (evt) => {
		this.setState({localContextUserNew: evt.value});
		// console.log(this.state, "inside local");
	}
	tempWorldContext = (evt) => {
		this.setState({worldContextUserNew: evt.value});
		// console.log(this.state, "inside world");
=======
	deleteRecord = () => {
		// when the event is deleted, need to reset store.modal.event so that the next time the eventlineitemedit is called, it does not show up with this old event in it.
		this.props.resetModalEvent();
		this.props.deleteEvent(this.props.event._id);
>>>>>>> bb5335684db5740b20e50b1bf81cc8b2fb26da9c
	}


	saveRecord = () => {
		console.log(this.state, "STATE saveRecord-Events");
		console.log(this.props, "PROPS of saveRecord-Events");

<<<<<<< HEAD
		if (this.state.eventDateUsernew !== this.props.event.eventDateNew) {
			this.getUpdateDate(this.props.event.person_id, "eventDateUser", this.stateeventDateUserNew);
		}
		if (this.state.eventTypeNew !== this.props.eventType) {
			this.getUpdateDate(this.props.person_id, "eventType", this.state.eventTypeNew)
		}
		if (this.state.eventPlace !== this.props.event.eventPlace) {
			this.getUpdateDate(this.props.event.person_id, "eventPlace", this.state.eventPlaceNew);
		}
		if (this.state.familyContext !== this.props.event.familyContext) {
			this.getUpdateDate(this.props.event.familyContext, "familyContext", this.state.familyContextNew);
		}
		if (this.state.localContext !== this.props.event.localContext) {
			this.getUpdateDate(this.props.event.localContext, "localContext", this.state.localContextNew);
		}
		if (this.state.worldContext !== this.props.event.worldContext) {
			this.getUpdateDate(this.props.event.worldContext, "worldContext", this.state.worldContextNew);
		}

		if(this.props.closeModal) {
			this.props.closeModal();
		}
	}

	deleteRecord = () => {
		this.props.deleteEvent(this.props.event._id);
		if(this.props.closeModal) {
			this.props.closeModal();
		}
	}

	render = () => {
		console.log(this.state, "render state");
		const { event, eventTypes} = this.props;

=======
>>>>>>> bb5335684db5740b20e50b1bf81cc8b2fb26da9c
		// only render if we have data to show
		if (event) {
			return (
			<div>
<<<<<<< HEAD
				<div class="event-main">
					<div class="event-row">
=======
				<div class="PR-main">
					<div class="PR-row-event">
>>>>>>> bb5335684db5740b20e50b1bf81cc8b2fb26da9c
						<div class="PR-div">
							<div class="PR-title">
								Date
							</div>
							<div class="PR-drop-1">
								<DateInput
									onNewDate={this.tempEventDate}
									initialValue={this.state.eventDateUserNew}
									field="eventDate"
								/>
							</div>
						</div>
					</div>
					<div class="event-row">
						<div class="PR-div">
							<div class="PR-title">
								Type
							</div>
							<div class="PR-drop-1">
								<Select
									options={eventTypes}
									onChange={this.tempEventType}
									initialValue={this.state.eventTypeNew}
								/>
							</div>
						</div>
						<div class="PR-div">
							<div class="PR-title">
								Place
							</div>
							<div class="PR-drop-1">
								<input
										class="form-control"
										type="text"
										initialValue={this.state.eventPlaceNew}
										onChange={this.tempEventPlace}
								/>
							</div>
						</div>
					</div>
				</div>
				<div class="PR-row-3">
<<<<<<< HEAD
					<div class="event-context-div">
						<div class="PR-event-title">
						Family Context
						</div>
						<div class="event-context">
							<textarea
									class="event-input"
=======
					<div class="PR-date-div">
						<div class="eventTitle">
						Family Context
						</div>
						<div class="PR-sDate">
							<textarea
									class="event-context"
>>>>>>> bb5335684db5740b20e50b1bf81cc8b2fb26da9c
									type="text"
									initialValue={this.state.familyContext}
									onChange={this.tempFamilyContext}
							>
							</textarea>
						</div>
					</div>
				</div>
				<div class="PR-row-3">
<<<<<<< HEAD
					<div class="event-context-div">
						<div class="PR-event-title">
						Local Context
						</div>
						<div class="event-context">
							<textarea
								class="event-input"
								type="text"
								initialValue={this.state.localContext}
								onChange={this.tempLocalContext}
							>
						</textarea>
=======
					<div class="PR-date-div">
						<div class="eventTitle">
						Local Context
						</div>
						<div class="PR-sDate">
							<textarea
									class="event-context"
									type="text"
									defaultValue={event.localContext}
									onBlur={this.getUpdateEvent('localContext')}
							/>
>>>>>>> bb5335684db5740b20e50b1bf81cc8b2fb26da9c
						</div>
					</div>
				</div>
				<div class="PR-row-3">
<<<<<<< HEAD
					<div class="event-context-div">
						<div class="PR-event-title">
						World Context
						</div>
						<div class="event-context">
							<textarea
									class="event-input"
=======
					<div class="PR-date-div">
						<div class="eventTitle">
						World Context
						</div>
						<div class="PR-sDate">
							<textarea
									class="event-context"
>>>>>>> bb5335684db5740b20e50b1bf81cc8b2fb26da9c
									type="text"
									initialValue={this.state.worldContext}
									onChange={this.tempWorldContext}
							>
							</textarea>
						</div>
					</div>
				</div>
				<div class="buffer-modal">
				</div>
<<<<<<< HEAD
				<div class="event-delete-modal">
					<button
						type="button"
						class="btn btn-default modal-delete"
						onClick={this.saveRecord}
					>
						Save
					</button>
					<button
						type="button"
						class="btn btn-default modal-delete"
						onClick={this.deleteRecord}
					>
						Delete
					</button>
				</div>
			</div>
			)
=======
				<div class="custom-input">
					<button class="button2" onClick={this.deleteRecord}>Delete</button>
				</div>
			</div>)
>>>>>>> bb5335684db5740b20e50b1bf81cc8b2fb26da9c
		} else {
			return (<p>Loading Event Info...</p>);
		}
	}
}
