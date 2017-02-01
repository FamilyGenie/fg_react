import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import DateInput from '../date-input';
import { updatePairBondRel, deletePairBondRel } from '../../actions/pairBondRelsActions';

@connect(
	(store, ownProps) => {
		// for the modal to work, we need to put the parentalRel in store (in the modal object). Passing the parameter from the parent component always results in the last parent showing up in the modal.
		// When we close the modal, there is no parentalRel object in the store, so check for that condition. If there is no parentalRel object found in the store, then just send through ownProps
		if (store.modal.pairBondRel) {
			var pairBondPerson_id;
			// ownProps.person._id is the id of the person who is being edited in the personDetails page. Figure out if they are personOne or personTwo of the pairBond recorpairBondP, and set the variable pairBondPerson as the other id
			if (ownProps.star._id === store.modal.pairBondRel.personOne_id) {
				pairBondPerson_id = store.modal.pairBondRel.personTwo_id
			} else {
				pairBondPerson_id = store.modal.pairBondRel.personOne_id
			}
			return {
				pairBondPerson:
					store.people.people.find(function(p) {
						return p._id === pairBondPerson_id;
					}),
				pairBondRel:
					store.modal.pairBondRel,
				pairBondRelTypes:
					store.pairBondRelTypes.pairBondRelTypes,
				star:
					ownProps.star,
				fetching:
					// if we are fetching the pairBondRels, reflect that in this prop
					store.pairBondRels.fetching,
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
			updatePairBondRel: (_id, field, value) => {
				dispatch(updatePairBondRel(_id, field, value));
			},
			deletePairBondRel: (_id) => {
				// the action to delete a pairBondRel requires a pass of the field name and the value
				dispatch(deletePairBondRel('_id', _id));
			}
		}
	}
)
export default class PairBondRelLineItemEdit extends React.Component {
constructor(props) {
	super(props);
	// this.state.relType stores the value for the relationshipType dropdown. Per the online forums, this is how you tell react-select what value to display (https://github.com/JedWatson/react-select/issues/796)
	this.state = {
		relType: this.props.pairBondRel.relationshipType,
		// the following value is for the drop down select box. If it is a new record that doesn't yet have a pairBondPerson associated with it, then we want to show the value of the box as empty. The Select component then defaults to the word "Select" to show the end user.
		pairPerson_id: ( this.props.pairBondPerson ? this.props.pairBondPerson._id : " "),
		// while in transition to using startDates and startDateUsers (and endDates and endDateUsers), if the User entered field does not yet exist, populate it with the startDate or endDate field. Eventually all records will have the 'User' fields and this code can be changed by removing the condition and just setting the field to the value from this.props.pairBondRel
		startDateUser: ( this.props.pairBondRel.startDateUser ? this.props.pairBondRel.startDateUser : this.props.pairBondRel.startDate),
		endDateUser: ( this.props.pairBondRel.endDateUser ? this.props.pairBondRel.endDateUser : this.props.pairBondRel.endDate),
	};
}

	onRelTypeChange = (evt) => {
		this.props.updatePairBondRel(this.props.pairBondRel._id, "relationshipType", evt.value);
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({relType: evt.value});
	}

	onPersonChange = (evt) => {
		// find out if star is personOne or personTwo in the pairBondRel record, and then update the other field with the id of the newly selected person
		if (this.props.star._id === this.props.pairBondRel.personOne_id) {
			this.props.updatePairBondRel(this.props.pairBondRel._id, "personTwo_id", evt.value);
		} else {
			this.props.updatePairBondRel(this.props.pairBondRel._id, "personOne_id", evt.value);
		}
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({pairPerson_id: evt.value})
	}

	// this call returns a function, so that when the field is updated, the fuction will execute.
	getUpdateDate = (field, dateUser, dateSet) => {
		// this is the function that will fire when the field is updated. first, it updates the data store. Then, it updates the appropriate field in the state, so that a display re-render is triggered
		return (field, dateUser, dateSet) => {
			this.props.updatePairBondRel(this.props.pairBondRel._id, field + "User", dateUser);
			// if the dateSet field is set to "Invalid date" from the Date-Input component, then update that field in the database to null
			if (dateSet === "Invalid date") {
				this.props.updatePairBondRel(this.props.pairBondRel._id, field, null);
			} else {
				this.props.updatePairBondRel(this.props.pairBondRel._id, field, dateSet);
			}
			if (field === "startDate") {
				this.setState({startDateUser: dateUser});
			} else {
				this.setState({endDateUser: dateUser})
			}
		}
	}

	deleteRecord = () => {
		this.props.deletePairBondRel(this.props.pairBondRel._id);
	}

	render = () => {

		// pairBondRelTypes are stored in the pairBondRelTypes reducer
		const { pairBondRel, pairBondRelTypes, pairBondPerson, fetching, peopleArray } = this.props;

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

		// only render if we are not fetching data
		if (pairBondRel) {
			return (
				<div class="PR-main">
					<div class="PR-row-1">
						<div class="PR-div">
							<div class="PR-title">
								Pair Bond Name
							</div>
							<div class="PR-drop-1">
								<Select
									options={peopleArray}
									onChange={this.onPersonChange}
									value={this.state.pairPerson_id}
								/>
							</div>
						</div>
						<div class="PR-div">
							<div class="PR-title">
								Relationship Type
							</div>
							<div class="PR-drop-1">
								<Select
									options={pairBondRelTypes}
									onChange={this.onRelTypeChange}
									value={this.state.relType}
								/>
							</div>
						</div>
					</div>

					<div class="PR-row-3">
						<div class="PR-date-div">
							<div class="PR-title">
							Start Date
							</div>
							<div class="PR-sDate">
								<DateInput defaultValue={this.state.startDateUser} field="startDate" updateFunction={this.getUpdateDate().bind(this)} />
							</div>
						</div>
						<div class="PR-date-div">
							<div class="PR-title">
							End Date
							</div>
							<div class="PR-eDate">
								<DateInput defaultValue={this.state.endDateUser} field="endDate" updateFunction={this.getUpdateDate().bind(this)} />
							</div>
						</div>
					</div>
					<div class="buffer-modal">
					</div>
					<div class="delete-modal">
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
