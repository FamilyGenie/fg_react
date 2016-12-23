import React from 'react';
import { connect } from "react-redux";



@connect(
	(store, ownProps) => {
		// console.log("in parentalrellineitemedit@connect with", ownProps);

		// for the modal to work, we need to put the parentalRel in store (in the modal object). Passing the parameter from the parent component always results in the last parent showing up in the modal.
		return {
			parentalRel:
				store.modal.parentalRel,
			// with the parent_id from the parentalRel object, get the details of the person who is the parent
			parent:
				store.people.people.find(function(p) {
					return p._id === store.modal.parentalRel.parent_id;
				}),
			// store.parentalRels.parentalRels.find(function(t) {
			//	return (t._id === ownProps.params._id);
		}
	}
)
export default class ParentalRelLineItemEdit extends React.Component {
	render = () => {

		// console.log("in parentalrellineitemedit render with", this.props);
		const { parentalRel, parent } = this.props;
		// console.log("in parentalrellineitemedit render with", parentalRel);

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
						<input
							class="form-control"
							type="text"
							defaultValue={parentalRel.startDate}
						/>
					</div>
					<div class="col-xs-2 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={parentalRel.endDate}
						/>
					</div>
				</div>)
		} else {
			return (<p>Loading Parental Info...</p>);
		}
	}
}
