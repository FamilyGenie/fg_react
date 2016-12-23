import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';

import EventLineItem from './event-lineitem';
import PairBondRelLineItem from './pairbondrel-lineitem';
import ParentalRelLineItem from './parentalrel-lineitem';
import ParentalRelLineItemEdit from './parentalrel-lineitem-edit';
import PeopleDetailsLineItem from './peopledetails-lineitem';
import { createPerson } from '../../actions/peopleActions';
import { closeModal, openModal} from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		// console.log("in peopledetails@connect with: ", store);
		return {
			person:
				store.people.people.find(function(p) {
					return p._id === ownProps.params._id;
				}),
			events:
				store.events.events.filter(function(e) {
					return e.person_id === ownProps.params._id;
				}),
			// get all pair bonds where the star of the page is either personOne or personTwo
			pairBondRels:
				store.pairBondRels.pairBondRels.filter(function(r) {
					return (r.personOne_id === ownProps.params._id ||
						r.personTwo_id === ownProps.params._id);
				}),
			// only get the parental rels where the star of the page is the child in the relationship.
			parentalRels:
				store.parentalRels.parentalRels.filter(function(t) {
					return (t.child_id === ownProps.params._id);
				}),
			modalIsOpen:
				store.modal.modalIsOpen
		};
	},
	(dispatch) => {
		return {
			createPerson: () => {
				dispatch(createPerson());
			},
		}
	}
)
export default class PeopleDetails extends React.Component {

	createPerson = () => {
		this.props.createPerson();
	}

	render = () => {

		const { person, events, pairBondRels, parentalRels, allDataIn, modalIsOpen } = this.props;

		const mappedEvents = events.map(event =>
			<EventLineItem event={event} key={event._id}/>
		);

		const mappedPairBondRels = pairBondRels.map(pairBondRel =>
			<PairBondRelLineItem pairBondRel={pairBondRel} key={pairBondRel._id} person={person}/>
		);

		const mappedParentalRels = parentalRels.map(parentalRel =>
			<ParentalRelLineItem parentalRel={parentalRel} key={parentalRel._id}/>
		);

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

		var modalStyle = {
			overlay: {
			position: 'fixed',
			top: 100,
			left: 100,
			right: 100,
			bottom: 100,
			}
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
					<div class="col-xs-12">
						Name & Type
					</div>
				</div>
				<div>
					{mappedParentalRels}
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
					{mappedPairBondRels}
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
					{mappedEvents}
				</div>
			</div>
		</div>
		);
	}
}
