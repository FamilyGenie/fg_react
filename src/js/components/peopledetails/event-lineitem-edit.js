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

	// this.state.relType stores the value for the relationshipType dropdown. Per the online forums, this is how you tell react-select what value to display (https://github.com/JedWatson/react-select/issues/796)
	this.state = {
		// while in transition to using startDates and startDateUsers (and endDates and endDateUsers), if the User entered field does not yet exist, populate it with the startDate or endDate field. Eventually all records will have the 'User' fields and this code can be changed by removing the condition and just setting the field to the value from this.props.pairBondRel

		eventDateNew: this.props.event.eventDate,
		eventDateUserNew: this.props.event.eventDateUser,

		eventTypeNew: this.props.event.eventType,

		eventPlaceNew: this.props.event.eventPlace,

		familyContextNew: this.props.event.familyContext,

		localContextNew: this.props.event.localContext,

		worldContextNew: this.props.event.worldContext,
	};
}

	// onEventTypeChange = (evt) => {
	// 	this.props.updateEvent(this.props.event._id, "eventType", evt.value);
	// 	// As well as updating the database and the store, update the state variable so the display shows the new value.
	// 	this.setState({eventType: evt.value});
	// }

	// // this call returns a function, so that when the field is updated, the fuction will execute.
	// getUpdateDate = (field, dateUser, dateSet) => {
	// 	// this is the function that will fire when the field is updated. first, it updates the data store. Then, it updates the appropriate field in the state, so that a display re-render is triggered
	// 	return (field, dateUser, dateSet) => {
	// 		this.props.updateEvent(this.props.event._id, field, dateSet);
	// 		this.props.updateEvent(this.props.event._id, field + "User", dateUser);
	// 		this.setState({startDateUser: dateUser});
	// 	}
	// }

	// getUpdateEvent = (field) => {
	// 	// have to return a function, because we don't know what evt.target.value is when the this page is rendered (and this function is called)
	// 	return (evt) => {
	// 		this.props.updateEvent(this.props.event._id, field, evt.target.value);
	// 	}
	// }

	// For event type, evt.value is used to access its information. Text areas/input boxes use evt.target.value


	tempEventDate = (parsedDate, userDate) => {
		this.setState({
			eventDateUserNew: userDate,
			eventDateNew: parsedDate
		});
		console.log(this.state, "inside eventDate");
	}
	tempEventType = (evt) => {
		this.setState({eventTypeNew: evt.value});
		// console.log(this.state, "inside eventType");
	}
	tempEventPlace = (evt) => {
		this.setState({eventPlaceNew: evt.target.value});
		// console.log(this.state, "inside eventPlace");
	}
	tempFamilyContext = (evt) => {
		this.setState({familyContextNew: evt.target.value});
		// console.log(this.state, "inside family");
	}
	tempLocalContext = (evt) => {
		this.setState({localContextNew: evt.target.value});
		// console.log(this.state, "inside local");
	}
	tempWorldContext = (evt) => {
		this.setState({worldContextNew: evt.target.value});
		// console.log(this.state, "inside world");
	}

	saveRecord = () => {
		console.log(this.state, "STATE saveRecord-Events");
		console.log(this.props, "PROPS of saveRecord-Events");

		if (this.state.eventDateUserNew !== this.props.event.eventDateUser) {
			this.props.updateEvent(this.props.event._id, "eventDateUser", this.state.eventDateUserNew);
			this.props.updateEvent(this.props.event._id, "eventDate", this.state.eventDateNew);
		}
		if (this.state.eventTypeNew !== this.props.event.eventType) {
			this.props.updateEvent(this.props.event._id, "eventType", this.state.eventTypeNew)
		}
		if (this.state.eventPlace !== this.props.event.eventPlace) {
			this.props.updateEvent(this.props.event._id, "eventPlace", this.state.eventPlaceNew);
		}
		if (this.state.familyContextNew !== this.props.event.familyContext) {
			this.props.updateEvent(this.props.event._id, "familyContext", this.state.familyContextNew);
		}
		if (this.state.localContextNew !== this.props.event.localContext) {
			this.props.updateEvent(this.props.event._id, "localContext", this.state.localContextNew);
		}
		if (this.state.worldContextNew !== this.props.event.worldContext) {
			this.props.updateEvent(this.props.event._id, "worldContext", this.state.worldContextNew);
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
		console.log(this.state, 'state of the state')
		const { event, eventTypes} = this.props;
		const { eventDateUser, eventType } = this.state;

		// only render if we have data to show
		if (event) {
			return (
			<div>
				<div class="event-main">
					<div class="event-row">
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
									value={this.state.eventTypeNew}
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
										value={this.state.eventPlaceNew}
										onChange={this.tempEventPlace}
								/>
							</div>
						</div>
					</div>
				</div>
				<div class="PR-row-3">
					<div class="PR-date-div">
						<div class="eventTitle">
						Family Context
						</div>
						<div class="PR-sDate">
							<textarea
									class="event-context"
									type="text"
									onChange={this.tempFamilyContext}
							>
							{this.state.familyContextNew}
							</textarea>
						</div>
					</div>
				</div>
				<div class="PR-row-3">
					<div class="event-context-div">
						<div class="eventTitle">
						Local Context
						</div>
						<div class="event-context">
							<textarea
								class="event-input"
								type="text"
								onChange={this.tempLocalContext}
							>
							{this.state.localContextNew}
						</textarea>
						</div>
					</div>
				</div>
				<div class="PR-row-3">
					<div class="PR-date-div">
						<div class="eventTitle">
						World Context
						</div>
						<div class="PR-sDate">
							<textarea
									class="event-context"
									type="text"
									onChange={this.tempWorldContext}
							>
							{this.state.worldContextNew}
							</textarea>
						</div>
					</div>
				</div>
				<div class="buffer-modal">
				</div>
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
			</div>)
		} else {
			return (<p>Loading Event Info...</p>);
		}
	}  // end render
}
