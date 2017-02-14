import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import DateInput from '../date-input';
import { updateEvent, deleteEvent } from '../../actions/eventsActions';

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
			return ownProps
		}
	},
	(dispatch) => {
		return {
			updateEvent: (_id, field, value) => {
				dispatch(updateEvent(_id, field, value));
			},
			deleteEvent: (_id) => {
				dispatch(deleteEvent(_id));
			}
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
		// eventType: (this.props.event.eventType ? this.props.event.eventType : " "),

		eventPlaceNew: this.props.event.eventPlace,
		eventPlaceUserNew: this.props.event.eventPlaceUser,

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

	tempEventDate = (parsedDate, userDate) => {
		this.setState({
			eventDateUserNew: userDate,
			eventDateNew: parsedDate
		});
	}
	tempEventType = (evt) => {
		this.setState({eventTypeNew: evt.value});
	}
	tempEventPlace = (evt) => {
		this.setState({eventPlaceNew: evt.value});
	}
	tempFamilyContext = (evt) => {
		this.setState({familyContextNew: evt.value});
	}
	tempLocalContext = (evt) => {
		this.setState({localContextNew: evt.value});
	}
	tempWorldContext = (evt) => {
		this.setState({worldContextNew: evt.value});
	}


	saveRecord = () => {
		console.log(this.state, "STATE saveRecord-Events");
		console.log(this.props, "PROPS of saveRecord-Events");

		if (this.state.eventDateUsernew !== this.props.event.eventDateNew) {
			this.getUpdateDate(this.props.event.person_id, "eventDateUser", this.stateeventDateUserNew);
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

		const { event, eventTypes, eventFamilyContext, eventLocalContext, eventWorldContext} = this.props;
		// const { eventDateUser, eventType } = this.state;


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
					<div class="event-context-div">
						<div class="PR-event-title">
						Family Context
						</div>
						<div class="event-context">
							<textarea
									class="event-input"
									type="text"
									initialValue={this.state.familyContext}
									onChange={this.tempFamilyContext}
							>
							</textarea>
						</div>
					</div>
				</div>
				<div class="PR-row-3">
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
						</div>
					</div>
				</div>
				<div class="PR-row-3">
					<div class="event-context-div">
						<div class="PR-event-title">
						World Context
						</div>
						<div class="event-context">
							<textarea
									class="event-input"
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
		} else {
			return (<p>Loading Event Info...</p>);
		}
	}
}
