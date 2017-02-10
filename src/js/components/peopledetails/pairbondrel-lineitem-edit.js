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
				...ownProps,
				pairBondPerson:
					store.people.people.find(function(p) {
						return p._id === pairBondPerson_id;
					}),
				pairBondRel:
					store.modal.pairBondRel,
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
				dispatch(deletePairBondRel(_id));
			}
		}
	}
)
export default class PairBondRelLineItemEdit extends React.Component {
constructor(props) {
	super(props);
	// this.state.relType stores the value for the relationshipType dropdown. Per the online forums, this is how you tell react-select what value to display (https://github.com/JedWatson/react-select/issues/796)
	this.state = {
		relTypeNew: this.props.pairBondRel.relationshipType,
		// the following value is for the drop down select box. If it is a new record that doesn't yet have a pairBondPerson associated with it, then we want to show the value of the box as empty. The Select component then defaults to the word "Select" to show the end user.
		pairBondPerson_idNew: (this.props.pairBondPerson ? this.props.pairBondPerson_id : " "),

		// while in transition to using startDates and startDateUsers (and endDates and endDateUsers), if the User entered field does not yet exist, populate it with the startDate or endDate field. Eventually all records will have the 'User' fields and this code can be changed by removing the condition and just setting the field to the value from this.props.pairBondRel

		startDateNew: this.props.pairBondRel.startDate,

		startDateUserNew: this.props.pairBondRel.startDateUser,

		endDateNew: this.props.pairBondRel.endDate,

		endDateUserNew: this.props.pairBondRel.endDateUser,



	};
}
	// these are the different types of pairBonds.
	// this needs to be moved into a reducer - use the parentalRelTypes reducer as an example, and how the parentalRelEdit modal accesses that data
	relTypes = [
		{ value: 'Marriage', label: 'Marriage' },
		{ value: 'Informal', label: 'Informal'}
	];


	// Utilizing this.setState is to maintain the immutability of the code

	tempPersonChange = (evt) => {
		this.setState({pairBondPerson_idNew: evt.value});
		console.log(this.state, "state inside of personChange");
	}
	tempRelTypeChange = (evt) => {
		this.setState({relTypeNew: evt.value});
	}
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
		console.log(this.state, "start of saveRecord-PB");
		console.log(this.props, "props");
		if (this.state.relTypeNew !== this.props.relType) {
			this.props.updatePairBondRel(this.props.pairBondRel._id, "relationshipType", this.state.relTypeNew);
		}
		if (this.props.pairBondPerson_id != this.state.pairBondPerson_idNew) {
			if (this.props.star._id === this.props.pairBondRel.personOne_id) {
				this.props.updatePairBondRel(this.props.pairBondPerson_id, "personTwo_id", this.state.pairBondPerson_id);
			} else {
				this.props.updatePairBondRel(this.props.pairBondPerson_id, "personOne_id", this.state.pairBondPerson_id);
			}
		}
		if (this.state.startDateUserNew !== this.props.pairBondRel.startDateUser) {
			this.props.updatePairBondRel(this.props.pairBondRel._id, "startDateUser", this.state.startDateUserNew);
		}
		if (this.state.startDateNew !== this.props.pairBondRel.startDate) {
			this.props.updatePairBondRel(this.props.pairBondRel._id, "startDate", this.state.startDateNew);
		}
		if (this.state.endDateUserNew !== this.props.pairBondRel.endDateUser) {
			this.props.updatePairBondRel(this.props.pairBondRel._id, "endDateUser", this.state.endDateUserNew);
		}
		if (this.state.endDateNew !== this.props.pairBondRel.endDate) {
			this.props.updatePairBondRel(this.props.pairBondRel._id, "endDate", this.state.endDateNew);
		}
		console.log(this.state, "end of save record");

		if(this.props.closeModal) {
			this.props.closeModal();
		}
	}
	deleteRecord = () => {
		console.log(this.state, "this is the state");
		if(this.props.closeModal) {
			this.props.closeModal();
		}
	}


	render = () => {

		const { pairBondRel, pairBondPerson, fetching, peopleArray } = this.props;


		// only render if we are not fetching data
		if (pairBondRel) {
			return (
				<div class="PB-main">
					<div class="PR-row-1">
						<div class="PR-div">
							<div class="PR-title">
								Pair Bond Name
							</div>
							<div class="PR-drop-1">
								<Select
									options={peopleArray}
									onChange={this.tempPersonChange}
									value={this.state.pairBondPerson_idNew}
								/>
							</div>
						</div>
						<div class="PR-div">
							<div class="PR-title">
								Relationship Type
							</div>
							<div class="PR-drop-1">
								<Select
									options={this.relTypes}
									onChange={this.tempRelTypeChange}
									value={this.state.relTypeNew}
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
								<DateInput 			 					initialValue={this.state.startDateUserNew}
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
								field="endDate"/>
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
