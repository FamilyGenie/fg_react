import React from 'react';
import { connect } from "react-redux";

@connect(
	(store, ownProps) => {
		// Since we are passing the person in from the parent object, just map the component's props to the props that have come in (for now).
		return ownProps;
	}
)
export default class PairBondRelLineItem extends React.Component {
	render = () => {

		const { pairBondRel } = this.props;

		if (pairBondRel) {
			return (
				<div class="row person-item">
					<div class="col-xs-4 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={pairBondRel.personOne_id}
						/>
					</div>
					<div class="col-xs-4 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={pairBondRel.personTwo_id}
						/>
					</div>
					<div class="col-xs-4 custom-input">
						<input
							class="form-control"
							type="text"
							defaultValue={pairBondRel.relationshipType}
						/>
					</div>
				</div>)
		} else {
			return (<p>Loading Pair Bonds...</p>);
		}
	}
}
