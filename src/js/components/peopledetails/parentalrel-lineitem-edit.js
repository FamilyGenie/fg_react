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
			console.log(store.modal.parentalRel);
			return {
				...ownProps,
				star:
					store.people.people.find (function(p) {
						return p._id === store.modal.parentalRel.child_id;
					}),
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
					})
			}
		} else {
			console.log("Did you forget to pass a parental rel?");
			// TODO This is silly
			return ownProps
		}
	},
	(dispatch) => {
		return {
			updateParentalRel: (_id, field, value) => {
				dispatch(updateParentalRel(_id, field, value));
			},
			deleteParentalRel: (_id) => {
				// the deleteParentalRel action requires you to send the field that you want to delete by, and then the value of that field for the record you want to delete.
				dispatch(deleteParentalRel('_id', _id));
			}
		}
	}
)
export default class ParentalRelLineItemEdit extends React.Component {
	constructor(props) {
		super(props);
		// the following value is for the drop down select box. If it is a new record that doesn't yet have a pairBondPerson associated with it, then we want to show the value of the box as empty. The Select component then defaults to the word "Select" to show the end user.
		this.state = {
			parent_idNew: this.props.parent ? this.props.parent._id : "",

			relationshipTypeNew: this.props.parentalRel.relationshipType,

			subTypeNew: this.props.parentalRel.subType,

			startDateNew: this.props.parentalRel.startDate,
			startDateUserNew: this.props.parentalRel.startDateUser,

			endDateNew: this.props.parentalRel.endDate,
			endDateUserNew: this.props.parentalRel.endDateUser

			// while in transition to using startDates and startDateUsers (and endDates and endDateUsers), if the User entered field does not yet exist, populate it with the startDate or endDate field. Eventually all records will have the 'User' fields and this code can be changed by removing the condition and just setting the field to the value from this.props.parentalRel

		}
	}

	tempSubTypeChange = (evt) => {
		this.setState({subTypeNew: evt.value})
	}
 	tempParentChange = (evt) => {
		this.setState({parent_idNew: evt.value});
	}
	tempRelTypeChange = (evt) => {
		this.setState({relationshipTypeNew: evt.value});
	}
	// different, because they come from date-input fields
	tempStartDate = (parsedDate, userDate) => {
		this.setState({
			startDateUserNew: userDate,
			startDateNew: parsedDate
		});
	}
	tempEndDate = (parsedDate, userDate) => {
		this.setState({
			endDateUserNew: userDate,
			endDateNew: parsedDate
		});
	}

	saveRecord = () => {
		if (this.state.relationshipTypeNew !== this.props.parentalRel.relationshipType) {
			this.props.updateParentalRel(this.props.parentalRel._id, "relationshipType", this.state.relationshipTypeNew);
		}
		if (this.props.parentalRel.parent_id != this.state.parent_idNew) {
			// Not 100% sure this works -- TEST THIS
			if (this.props.star._id === this.props.parentalRel.parent_id) {
				alert ("the child can't be their own parent");
			}
			else {
				this.props.updateParentalRel(this.props.parentalRel._id, "parent_id", this.state.parent_idNew);
			}
		}
		if (this.state.subTypeNew !== this.props.parentalRel.subType) {
			this.props.updateParentalRel(this.props.parentalRel._id, "subType", this.state.subTypeNew);
		}
		if (this.state.startDateUserNew !== this.props.parentalRel.startDateUser) {
			this.props.updateParentalRel(this.props.parentalRel._id, "startDateUser", this.state.startDateUserNew);
		}
		if (this.state.startDateNew !== this.props.parentalRel.startDate) {
			this.props.updateParentalRel(this.props.parentalRel._id, "startDate", this.state.startDateNew);
		}
		if (this.state.endDateUserNew !== this.props.parentalRel.endDateUser) {
			this.props.updateParentalRel(this.props.parentalRel._id, "endDateUser", this.state.endDateUserNew);
		}
		if (this.state.endDateNew !== this.props.parentalRel.endDate) {
			this.props.updateParentalRel(this.props.parentalRel._id, "endDate", this.state.endDateNew);
		}
		if (this.props.closeModal) {
			this.props.closeModal();
		}
	}
	deleteRecord = () => {
		this.props.deleteParentalRel(this.props.parentalRel._id, evt.value);

		if (this.props.closeModal) {
			this.props.closeModal();
		}
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
									value={this.state.parent_idNew}
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
											value={this.state.relationshipTypeNew}
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
											options={parentalRelSubTypes}
											onChange={this.tempSubTypeChange}
											value={this.state.subTypeNew}
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
									initialValue={this.state.startDateUserNew}
									onNewDate={this.tempStartDate}
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
									initialValue={this.state.endDateUserNew}
									onNewDate={this.tempEndDate}
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
