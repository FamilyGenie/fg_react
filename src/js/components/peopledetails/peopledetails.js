import React from 'react';
import { connect } from "react-redux";

import EventsLineItem from './events-lineitem';
import PeopleDetailsLineItem from './peopledetails-lineitem';
import { createPerson } from '../../actions/peopleActions';

@connect(
	(store, ownProps) => {
		console.log("in peopledetails @connect, with: ", ownProps.params._id, store.events.events);
		// console.log(store.events.events.find(function(e) {
		// 			return e._id === ownProps.params._id;}
		return {
			person:
				store.people.people.find(function(p) {
					return p._id === ownProps.params._id;
				}),
			events:
				store.events.events.find(function(e) {
					return e.person_id === ownProps.params._id;
				})
			// need to add events here.
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

		console.log("in peopledetails.render with: ", this.props);
		const { person, events } = this.props;

		var divStyle = {
			borderWidth: "1px",
			borderColor: "gray",
			borderStyle: "solid",
			marginTop: "30px",
			marginRight: "0px",
			paddingBottom: "5px",
		}

		var headingStyle = {
			textAlign: "center",
			color: "#333333",
			fontWeight: "bold",
			fontSize: "1.25em",
			marginBottom: 10,
		}

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
				<div class="col-xs-2 title bold can-click">
					Last Name
				</div>
			</div>
			<div>
				<PeopleDetailsLineItem person={person} />
			</div>
			<div class="container col-xs-4" style={divStyle}>
				<div class="row">
					<div class="col-xs-12" style={headingStyle}>
						Parents
					</div>
				</div>
				<div class="row">
					<div class="col-xs-4 title bold can-click">
						fName
					</div>
					<div class="col-xs-4 title bold can-click">
						lName
					</div>
					<div class="col-xs-4 title bold can-click">
						Type
					</div>
				</div>
				<div>
					<EventsLineItem events={events} />
				</div>
			</div>
			<div class="container col-xs-4" style={divStyle}>
				<div class="row">
					<div class="col-xs-12" style={headingStyle}>
						PairBonds
					</div>
				</div>
				<div class="row">
					<div class="col-xs-4 title bold can-click">
						fName
					</div>
					<div class="col-xs-4 title bold can-click">
						lName
					</div>
					<div class="col-xs-4 title bold can-click">
						Type
					</div>
				</div>
				<div>
					<EventsLineItem events={events} />
				</div>
			</div>
			<div class="container col-xs-4" style={divStyle}>
				<div class="row">
					<div class="col-xs-12" style={headingStyle}>
						Person Chronology
					</div>
				</div>
				<div class="row">
					<div class="col-xs-4 title bold can-click">
						Date
					</div>
					<div class="col-xs-4 title bold can-click">
						Event
					</div>
					<div class="col-xs-4 title bold can-click">
						Place
					</div>
				</div>
				<div>
					<EventsLineItem events={events} />
				</div>
			</div>
		</div>
		);
	}
}
