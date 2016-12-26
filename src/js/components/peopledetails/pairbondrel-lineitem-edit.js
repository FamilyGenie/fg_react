import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import DateInput from '../date-input';
import { updatePairBondRel } from '../../actions/pairBondRelsActions';

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
	};
}
	// these are the different types of pairBonds.
	relTypes = [
		{ value: 'Marriage', label: 'Marriage' },
		{ value: 'Informal', label: 'Informal'}
	];

	onRelTypeChange = (evt) => {
		this.props.updatePairBondRel(this.props.pairBondRel._id, "relationshipType", evt.value);
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({relType: evt.value});
	}

	onPersonChange = (evt) => {
		console.log("in onPersonChange with: ", evt.value, this.props.pairBondRel);
		// find out if star is personOne or personTwo in the pairBondRel record, and then update the other field with the id of the newly selected person
		if (this.props.star._id === this.props.pairBondRel.personOne_id) {
			this.props.updatePairBondRel(this.props.pairBondRel._id, "personTwo_id", evt.value);
		} else {
			this.props.updatePairBondRel(this.props.pairBondRel._id, "personOne_id", evt.value);
		}
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({pairPerson_id: evt.value})
	}

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
			console.log("In parentalRel lineitem updateDate, with: ", field,displayDate, setDate);
			// next, you just need to call this.props.updateParentalRel and update both the setDate and the displayDate
		}
	}

	render = () => {

		const { pairBondRel, pairBondPerson, fetching, peopleArray } = this.props;

		var buttonStyle = {
		}

		// only render if we are not fetching data
		if (!fetching) {
			return (
				<div class="row person-item">
					<div class="col-xs-2 custom-input">
						<Select
							options={peopleArray}
							onChange={this.onPersonChange}
							value={this.state.pairPerson_id}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<Select
							options={this.relTypes}
							onChange={this.onRelTypeChange}
							value={this.state.relType}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<DateInput defaultValue={pairBondRel.startDate} field="startDate" updateFunction={this.getUpdateDate().bind(this)} />
					</div>
					<div class="col-xs-2 custom-input">
						<DateInput defaultValue={pairBondRel.endDate} field="endDate" updateFunction={this.getUpdateDate().bind(this)} />
					</div>
					<div class="col-xs-1 custom-input">
						<button
							class="btn btn-primary btn-round"
							style={buttonStyle}
							onClick={this.deleteRecord}
						>
							-
						</button>
					</div>
				</div>)
		} else {
			return (<p>Loading Parental Info...</p>);
		}
	}
}
