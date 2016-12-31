import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import DateInput from '../date-input';
import { updateEvent, deleteEvent } from '../../actions/eventsActions';

@connect(
	(store, ownProps) => {
		console.log("In EventLineItemEdit @connect with Store:", store);
		// for the modal to work, we previously put the event in store (in the modal object). Passing the parameter from the parent component always results in the last parent showing up in the modal.
		// When we close the modal, there is no event object in the store, so check for that condition. If there is no event object found in the store, then just send through ownProps
		if (store.modal.event) {
			return {
				event:
					store.modal.event,
				eventTypes:
					store.eventTypes.eventTypes,
				star:
					store.modal.event.person_id,
				// peopleArray:
				// 	store.people.people.map(function(person) {
				// 		var newObj = {};
				// 		var label = person.fName + ' ' + person.lName;
				// 		var value = person._id;
				// 		newObj["value"] = value;
				// 		newObj["label"] = label;
				// 		return newObj;
				// 	}),
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
	console.log("in EventLineItemEdit constructor with: ", this.props);
	this.state = {
		// while in transition to using startDates and startDateUsers (and endDates and endDateUsers), if the User entered field does not yet exist, populate it with the startDate or endDate field. Eventually all records will have the 'User' fields and this code can be changed by removing the condition and just setting the field to the value from this.props.pairBondRel
		eventDateUser: ( this.props.event.eventDateUser ? this.props.event.eventDateUser : this.props.event.eventDate),
// 		star_id: this.props.event.person_id,
		eventType: this.props.event.type,
	};
}

	onEventTypeChange = (evt) => {
		this.props.updateEvent(this.props.event._id, "type", evt.value);
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({eventType: evt.value});
	}

	// onPersonChange = (evt) => {
	// 	// Update the record with the newly selected parent
	// 	this.props.updateEvent(this.props.event._id, "person_id", evt.value);
	// 	// As well as updating the database and the store, update the state variable so the display shows the new value.
	// 	this.setState({person_id: evt.value});
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

	deleteRecord = () => {
		this.props.deleteEvent(this.props.event._id);
	}

	render = () => {

		const { event, eventTypes} = this.props;
		const { eventDateUser, eventType } = this.state;

		var nameCol = {
			width: "15%",
			marginLeft: "5px",
			marginRight: "5px",
		}
		var relCol = {
			width: "15%",
			marginLeft: "5px",
			marginRight: "5px",
		}
		var dateCol = {
			width: "15%",
			marginLeft: "5px",
			marginRight: "5px",
		}
		var buttonCol = {
			width: "5%",
			marginLeft: "5px",
			marginRight: "5px",
		}

		// only render if we have data to show
		if (event) {
			return (
				<div class="infoRow">
					<div class="custom-input" style={dateCol}>
						<DateInput defaultValue={eventDateUser} field="eventDate" updateFunction={this.getUpdateDate().bind(this)} />
					</div>
					{/*
					<div class="custom-input" style={nameCol}>
						<Select
							options={peopleArray}
							onChange={this.onPersonChange}
							value={star_id}
						/>
					</div>
					*/}
					<div class="custom-input" style={relCol}>
						<Select
							options={eventTypes}
							onChange={this.onEventTypeChange}
							value={eventType}
						/>
					</div>
					<div class="custom-input" style={buttonCol}>
						<i class="fa fa-minus-square buttonSize" onClick={this.deleteRecord}></i>
					</div>
				</div>)
		} else {
			return (<p>Loading Event Info...</p>);
		}
	}
}
