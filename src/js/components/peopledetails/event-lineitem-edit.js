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
				event:
					store.modal.event,
				eventTypes:
					store.eventTypes.eventTypes,
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
		eventDateUser: ( this.props.event.eventDateUser ? this.props.event.eventDateUser : this.props.event.eventDate),
		eventType: this.props.event.eventType,
	};
}

	onEventTypeChange = (evt) => {
		this.props.updateEvent(this.props.event._id, "eventType", evt.value);
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({eventType: evt.value});
	}

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

	deleteRecord = () => {
		// when the event is deleted, need to reset store.modal.event so that the next time the eventlineitemedit is called, it does not show up with this old event in it.
		this.props.resetModalEvent();
		this.props.deleteEvent(this.props.event._id);
	}

	render = () => {

		const { event, eventTypes} = this.props;
		const { eventDateUser, eventType } = this.state;

		// only render if we have data to show
		if (event) {
			return (
			<div>
				<div class="PR-main">
					<div class="PR-row-event">
						<div class="PR-div">
							<div class="PR-title">
								Date
							</div>
							<div class="PR-drop-1">
								<DateInput defaultValue={eventDateUser} field="eventDate" updateFunction={this.getUpdateDate().bind(this)} />
							</div>
						</div>
					</div>
					<div class="PR-row-event">
						<div class="PR-div">
							<div class="PR-title">
								Type
							</div>
							<div class="PR-drop-1">
								<Select
									options={eventTypes}
									onChange={this.onEventTypeChange}
									value={eventType}
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
										defaultValue={event.eventPlace}
										onBlur={this.getUpdateEvent('eventPlace')}
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
									defaultValue={event.familyContext}
									onBlur={this.getUpdateEvent('familyContext')}
							/>
						</div>
					</div>
				</div>
				<div class="PR-row-3">
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
									defaultValue={event.worldContext}
									onBlur={this.getUpdateEvent('worldContext')}
							/>
						</div>
					</div>
				</div>
				<div class="buffer-modal">
				</div>
				<div class="custom-input">
					<button class="button2" onClick={this.deleteRecord}>Delete</button>
				</div>
			</div>)
		} else {
			return (<p>Loading Event Info...</p>);
		}
	}
}
