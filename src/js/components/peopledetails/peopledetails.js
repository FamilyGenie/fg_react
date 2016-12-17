import React from 'react';
import { connect } from "react-redux";

import PeopleDetailsLineItem from './peopledetails-lineitem';
import { createPerson } from '../../actions/peopleActions';

@connect(
	(store, ownProps) => {
		return {
			person:
				store.people.people.find(function(p) {
					return p._id === ownProps.params._id;
				})
		};
	},
	(dispatch) => {
		return {
			createPerson: () => {
				console.log("in dispatch.createPerson");
				dispatch(createPerson());
			}

		}
	}
)
export default class PeopleDetails extends React.Component {

	createPerson = () => {
		console.log("in peopledetails, createPerson, with: ", this.props);
		this.props.createPerson();
	}

	render = () => {
		const { person } = this.props;

		return (<div>
			<div class="container">
				<div class="col-xs-10">
					<h1>Family Members</h1>
				</div>
				<div class="col-xs-2 custom-input">
					<button
						class="form-control"
						onClick={this.createPerson}
					>
						Create New
					</button>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-2 title bold can-click">
					First Name
				</div>
				<div class="col-xs-2 title bold can-click">
					Middle Name
				</div>
			</div>
			<div>
				<PeopleDetailsLineItem person={person} />
			</div>
		</div>);
	}
}
