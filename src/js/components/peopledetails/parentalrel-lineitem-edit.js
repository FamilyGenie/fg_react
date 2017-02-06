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


		relationshipType: ( this.props.parentalRel ? this.props.parentalRel.relationshipType : this.props.parentalRel.realtionshipType),
		relationshipTypeInitial: ( this.props.parentalRel.relationshipType: " "),


		// subType: ( this.props.parentalRel ?
		// this.props.parentalRel.subType : " "),

		subType: ( this.props.parentalRel ?
		this.props.parentalRel.subType :
		this.props.parentalRel.subType),

		subTypeInitial: ( this.props.parentalRel ?
		this.props.parentalRel.subType : " "),
		// while in transition to using startDates and startDateUsers (and endDates and endDateUsers), if the User entered field does not yet exist, populate it with the startDate or endDate field. Eventually all records will have the 'User' fields and this code can be changed by removing the condition and just setting the field to the value from this.props.parentalRel

		startDateUser: ( this.props.parentalRel.startDateUser ? this.props.parentalRel.startDateUser :
		this.props.parentalRel.startDate),

		startDateInitial: ( this.props.parentalRel.startDateUser ? this.props.parentalRel.startDateUser : " "),


		endDateUser: ( this.props.parentalRel.endDateUser ?
		this.props.parentalRel.endDateUser :
		this.props.parentalRel.endDate),

		endDateInitial: (this.props.parentalRel.endDateUser ?
		this.props.pairBondRel.endDateUser : " "),
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
			// if the dateSet field is set to "Invalid date" from the Date-Input component, then update that field in the database to null
			if (dateSet === "Invalid date") {
				this.props.updateParentalRel(this.props.parentalRel._id, field, null);
			} else {
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

	// onParentChange = (evt) => {
	// 	// Update the record with the newly selected parent
	// 	this.props.updateParentalRel(this.props.parentalRel._id, "parent_id", evt.value);
	// 	// As well as updating the database and the store, update the state variable so the display shows the new value.
	// 	this.setState({parent_id: evt.value});
	// }
	//
	// onRelTypeChange = (evt) => {
	// 	// Update the record with the newly selected parent
	// 	this.props.updateParentalRel(this.props.parentalRel._id, "relationshipType", evt.value);
	// 	// As well as updating the database and the store, update the state variable so the display shows the new value.
	// 	this.setState({relationshipType: evt.value});
	// }

	// onSubTypeChange = (evt) => {
	// 	// Update the record with the newly selected parent
	// 	this.props.updateParentalRel(this.props.parentalRel._id, "subType", evt.value);
	// 	// As well as updating the database and the store, update the state variable so the display shows the new value.
	// 	this.setState({subType: evt.value});
	// }

	tempSubTypeChange = (evt) => {
		this.setState({subType: evt.value})
	}
 	tempParentChange = (evt) => {
		this.setState({parent_id: evt.value});
	}
	tempRelTypeChange = (evt) => {
		this.setState({relationshipType: evt.value});
	}
	tempStartDate = (evt) => {
		this.setState({startDateUser: evt.value});
	}
	tempEndDate = (evt) => {
		this.setState({endDateUser: evt.value});
	}

	saveRecord = () => {
		console.log(this.state, "start of save record");
		if (this.state.relType !== this.state.relTypeInitial) {
			this.props.updateParentalRel(this.props.parent_id, "relationshipType", this.state.relType);
		}
		if (this.state.parent_id != this.state.parent_idInitial) {
			// if (this.props.star._id === this.props.parent)
		}
	}
	deleteRecord = () => {
		this.props.deleteParentalRel(this.props.parentalRel._id);
	}

	render = () => {

		const { parentalRel, parent, peopleArray, parentalRelTypes, parentalRelSubTypes } = this.props;


		if (parentalRel) {
			return (
				<div class="PR-main">
					<div class="PR-row-1">
						<div class="PR-div">
							<div class="PR-title">
								Parent Name
							</div>
							<div class="PR-drop-name">
								<Select
									options={peopleArray}
									onChange={this.tempParentChange}
									value={this.state.parent_id}
								/>
							</div>
						</div>
					</div>
					<div class="PR-row-2">
						<div class="PR-sub-div">
							<div class="PR-div">
								<div class="PR-title">
									Relationship
								</div>
								<div class="PR-drops">
									<div class="PR-drop-2">
										<Select
											options={parentalRelTypes}
											onChange={this.tempRelTypeChange}
											value={this.state.relationshipType}
										/>
									</div>
								</div>
							</div>
							<div class="PR-div">
								<div class="PR-title">
									Sub Type
								</div>
								<div class="PR-drops">
									<div class="PR-drop-2">
										<Select
											options={this.parentalRelSubTypes}
											onChange={this.tempSubTypeChange}
											value={this.state.subType}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="PR-row-3">
						<div class="PR-date-div">
							<div class="PR-title">
							Start Date
							</div>
							<div class="PR-sDate">
								<DateInput
									defaultValue={this.state.startDateUser}
									onChange={this.tempStartDate}
									field="startDate"
								/>
							</div>
						</div>
						<div class="PR-date-div">
							<div class="PR-title">
							End Date
							</div>
							<div class="PR-eDate">
								<DateInput
									defaultValue={this.state.endDateUser}
									onChange={this.tempEndDate}
									field="endDate"
								/>
							</div>
						</div>
					</div>
					<div class="buffer-modal">
					</div>
					<div class="delete-modal">
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
			return (<p>Loading Parental Info...</p>);
		}
	}
}
