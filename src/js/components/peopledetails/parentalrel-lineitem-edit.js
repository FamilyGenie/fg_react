import React from 'react';
import { connect } from 'react-redux';

import DateInput from '../date-input';
import { updateParentalRel } from '../../actions/parentalRelsActions';

@connect(
	(store, ownProps) => {
		// for the modal to work, we need to put the parentalRel in store (in the modal object). Passing the parameter from the parent component always results in the last parent showing up in the modal.
		// When we close the modal, there is no parentalRel object in the store, so check for that condition. If there is no parentalRel object found in the store, then just send through ownProps
		if (store.modal.parentalRel) {
			return {
				parentalRel:
					store.modal.parentalRel,
				// with the parent_id from the parentalRel object, get the details of the person who is the parent
				parent:
					store.people.people.find(function(p) {
						return p._id === store.modal.parentalRel.parent_id;
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
			}
		}
	}
)
export default class ParentalRelLineItemEdit extends React.Component {

	getOnBlur = (field) => {
		// have to return a function, because we don't know what evt.target.value is when this page is rendered (and this function is called)
		// console.log("in getOnBlur: ", this.props, field);
		return (evt) => {
			this.props.updateParentalRel(this.props.parentalRel._id, field, evt.target.value)
		}
	}

	getUpdateDate = (field, displayDate, setDate) => {
		return (field, displayDate, setDate) => {
			console.log("In parentalRel lineitem updateDate, with: ", field,displayDate, setDate);
			// next, you just need to call this.props.updateParentalRel and update both the setDate and the displayDate
		}
	}

	render = () => {

		const { parentalRel, parent } = this.props;

		if (parentalRel) {
			return (
				<div class="row person-item">
					<div class="col-xs-2 custom-input">
						{parent.fName} {parent.lName}
					</div>
					<div class="col-xs-2 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={parentalRel.relationshipType}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={parentalRel.subType}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<DateInput defaultValue={parentalRel.startDate} field="startDate" updateFunction={this.getUpdateDate().bind(this)} />
						{/*
						<input
							class="form-control"
							type="text"
							defaultValue={parentalRel.startDate}
							onBlur={this.getOnBlur('startDate')}
						/>
						*/}
					</div>
					<div class="col-xs-2 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={parentalRel.endDate}
							onBlur={this.getOnBlur('endDate')}
						/>
					</div>
				</div>)
		} else {
			return (<p>Loading Parental Info...</p>);
		}
	}
}
