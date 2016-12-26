import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import DateInput from '../date-input';
import { updatePairBondRel } from '../../actions/pairBondRelsActions';

@connect(
	(store, ownProps) => {
		// for the modal to work, we need to put the parentalRel in store (in the modal object). Passing the parameter from the parent component always results in the last parent showing up in the modal.
		// When we close the modal, there is no parentalRel object in the store, so check for that condition. If there is no parentalRel object found in the store, then just send through ownProps
		// console.log("in PairBondRelLineItemEdit @connect, with: ", ownProps);
		if (store.modal.pairBondRel) {
			var pairBondPerson_id;
			// ownProps.person._id is the id of the person who is being edited in the personDetails page. Figure out if they are personOne or personTwo of the pairBond recorpairBondP, and set the variable pairBondPerson as the other id
			if (ownProps.star._id === store.modal.pairBondRel.personOne_id) {
				pairBondPerson_id = store.modal.pairBondRel.personTwo_id
			} else {
				pairBondPerson_id = store.modal.pairBondRel.personOne_id
			}
			console.log("in PairBondRelLineItemEdit @connect with: ", pairBondPerson_id);
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
	this.state = {relType: this.props.pairBondRel.relationshipType}
}
	relTypes = [
		{ value: 'Marriage', label: 'Marriage' },
		{ value: 'Informal', label: 'Informal'}
	];

	getOnBlur = (field) => {
		// have to return a function, because we don't know what evt.target.value is when this page is rendered (and this function is called)
		// console.log("in getOnBlur: ", this.props, field);
		return (evt) => {
			// this.props.updateParentalRel(this.props.pairBondRel._id, field, evt.target.value)
			console.log("In onChange, with: ", field, evt.value);
		}
	}

	onRelTypeChange = (evt) => {
		// console.log("in onRelTypeChange, with: ", this.props.pairBondRel._id, "relationshipType", evt.value);
		this.props.updatePairBondRel(this.props.pairBondRel._id, "relationshipType", evt.value);
		// As well as updating the database and the store, update the state variable so the display shows the new value.
		this.setState({relType: evt.value});
	}

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
			console.log("In parentalRel lineitem updateDate, with: ", field,displayDate, setDate);
			// next, you just need to call this.props.updateParentalRel and update both the setDate and the displayDate
		}
	}

	render = () => {

		const { pairBondRel, pairBondPerson, fetching } = this.props;
		// console.log("in pairbondrel edit render with: ", pairBondRel.relationshipType);

		var buttonStyle = {
		}

		// only render if we are not fetching data
		if (!fetching) {
			return (
				<div class="row person-item">
					<div class="col-xs-2 custom-input">
						{pairBondPerson.fName} {pairBondPerson.lName}
					</div>
					{/*}
					<div class="col-xs-2 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={pairBondRel.relationshipType}
						/>
					</div>
					*/}
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
