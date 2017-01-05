import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import DateInput from '../date-input';
import { updateParentalRel, deleteParentalRel } from '../../actions/parentalRelsActions';

@connect(
	(store, ownProps) => {
		// for the modal to work, we need to put the parentalRel in store (in the modal object). Passing the parameter from the parent component always results in the last parent showing up in the modal.
		// When we close the modal, there is no parentalRel object in the store, so check for that condition. If there is no parentalRel object found in the store, then just send through ownProps
		if (store.modal.parentalRel) {
			return {
				parentalRel:
					store.modal.parentalRel,
				// with the parent_id from the parentalRel object, get the details of the person who is the parent
				parentalRelTypes:
					store.parentalRelTypes.parentalRelTypes,
				parentalRelSubTypes:
					store.parentalRelSubTypes.parentalRelSubTypes,
				parent:
					store.people.people.find(function(p) {
						return p._id === store.modal.parentalRel.parent_id;
					}),
				peopleArray:
					store.people.people.map(function(person) {
						var newObj = {};
						var label = person.fName + ' ' + person.lName;
						var value = person._id;
						newObj["value"] = value;
						newObj["label"] = label;
						return newObj;
					}),
			}
		} else {
			return ownProps
		}
	},
	(dispatch) => {
		return {
			updateParentalRel: (_id, field, value) => {
				dispatch(updateParentalRel(_id, field, value));
			},
			deleteParentalRel: (_id) => {
				dispatch(deleteParentalRel(_id));
			}
		}
	}
)
export default class ParentalRelLineItemEdit extends React.Component {
constructor(props) {
	super(props);
	// the following value is for the drop down select box. If it is a new record that doesn't yet have a pairBondPerson associated with it, then we want to show the value of the box as empty. The Select component then defaults to the word "Select" to show the end user.
	this.state = {
		parent_id: ( this.props.parent ? this.props.parent._id : " "),
		relationshipType: ( this.props.parentalRel ? this.props.parentalRel.relationshipType : " "),
		subType: ( this.props.parentalRel ? this.props.parentalRel.subType : " "),
		// while in transition to using startDates and startDateUsers (and endDates and endDateUsers), if the User entered field does not yet exist, populate it with the startDate or endDate field. Eventually all records will have the 'User' fields and this code can be changed by removing the condition and just setting the field to the value from this.props.parentalRel
		startDateUser: ( this.props.parentalRel.startDateUser ? this.props.parentalRel.startDateUser : this.props.parentalRel.startDate),
		endDateUser: ( this.props.parentalRel.endDateUser ? this.props.parentalRel.endDateUser : this.props.parentalRel.endDate),
	}
}

	getOnBlur = (field) => {
		// have to return a function, because we don't know what evt.target.value is when this page is rendered (and this function is called)
		return (evt) => {
			this.props.updateParentalRel(this.props.parentalRel._id, field, evt.target.value)
		}
	}

	// this call returns a function, so that when the field is updated, the fuction will execute.
	getUpdateDate = (field, dateUser, dateSet) => {
		// this is the function that will fire when the field is updated. first, it updates the data store. Then, it updates the appropriate field in the state, so that a display re-render is triggered
		return (field, dateUser, dateSet) => {
			this.props.updateParentalRel(this.props.parentalRel._id, field + "User", dateUser);
			// only update the dateSet if the field has data in it. If the field is left empty by the end user, then the dateSet field is set to "Invalid date", and we don't want to update it
			if (dateSet !== "Invalid date") {
				this.props.updateParentalRel(this.props.parentalRel._id, field, dateSet);
			}
			// set the appropriate state variable
			if (field === "startDate") {
				this.setState({startDateUser: dateUser});
			} else {
				this.setState({endDateUser: dateUser})
			}
		}
	}

	onParentChange = (evt) => {
		// Update the record with the newly selected parent
		this.props.updateParentalRel(this.props.parentalRel._id, "parent_id", evt.value);
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({parent_id: evt.value});
	}

	onRelTypeChange = (evt) => {
		// console.log("in onRelTypeChange with: ", evt.value, this.props.parentalRel);
		// Update the record with the newly selected parent
		this.props.updateParentalRel(this.props.parentalRel._id, "relationshipType", evt.value);
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({relationshipType: evt.value});
	}

	onSubTypeChange = (evt) => {
		// console.log("in onRelTypeChange with: ", evt.value, this.props.parentalRel);
		// Update the record with the newly selected parent
		this.props.updateParentalRel(this.props.parentalRel._id, "subType", evt.value);
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({subType: evt.value});
	}

	deleteRecord = () => {
		this.props.deleteParentalRel(this.props.parentalRel._id);
	}

	render = () => {

		const { parentalRel, parent, peopleArray, parentalRelTypes, parentalRelSubTypes } = this.props;

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

		if (parentalRel) {
			return (
				<div class="infoRow">
					<div class="custom-input" style={nameCol}>
						<Select
							options={peopleArray}
							onChange={this.onParentChange}
							value={this.state.parent_id}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<Select
							options={parentalRelTypes}
							onChange={this.onRelTypeChange}
							value={this.state.relationshipType}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<Select
							options={parentalRelSubTypes}
							onChange={this.onSubTypeChange}
							value={this.state.subType}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<DateInput defaultValue={parentalRel.startDateUser} field="startDate" updateFunction={this.getUpdateDate().bind(this)}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<DateInput defaultValue={parentalRel.endDateUser} field="endDate" updateFunction={this.getUpdateDate().bind(this)}
						/>
					</div>
					<div class="custom-input" style={buttonCol}>
						<i class="fa fa-minus-square buttonSize" onClick={this.deleteRecord}></i>
					</div>
				</div>)
		} else {
			return (<p>Loading Parental Info...</p>);
		}
	}
}
