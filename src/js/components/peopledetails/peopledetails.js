import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';

import EventLineItem from './event-lineitem';
import PairBondRelLineItem from './pairbondrel-lineitem';
import ParentalRelLineItem from './parentalrel-lineitem';
import ParentalRelLineItemEdit from './parentalrel-lineitem-edit';
import PeopleDetailsLineItem from './peopledetails-lineitem';
import { createPerson } from '../../actions/peopleActions';
import { createPairBondRel } from '../../actions/pairBondRelsActions';
import { closeModal, openModal} from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		return {
			star:
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
			createPairBondRel: (star_id) => {
				dispatch(createPairBondRel(star_id, null, "", "", "", "", ""));
			}
		}
	}
)
export default class PeopleDetails extends React.Component {

	createPerson = () => {
		this.props.createPerson();
	}

	createPairBondRel = () => {
		console.log("in create Pair Bond Rel with: ", this.props.star._id);
		this.props.createPairBondRel(this.props.star._id);
	}

	render = () => {

		const { star, events, pairBondRels, parentalRels, allDataIn, modalIsOpen } = this.props;

		const mappedEvents = events.map(event =>
			<EventLineItem event={event} key={event._id}/>
		);

		const mappedPairBondRels = pairBondRels.map(pairBondRel =>
			<PairBondRelLineItem pairBondRel={pairBondRel} key={pairBondRel._id} person={star}/>
		);


		const mappedParentalRels = parentalRels.map(parentalRel =>
			<ParentalRelLineItem parentalRel={parentalRel} key={parentalRel._id}/>
		);

		var divStyle = {
			borderWidth: "1px",
			borderColor: "gray",
			borderStyle: "solid",
			marginTop: "30px",
			marginRight: "10px",
			marginLeft: "10px",
			paddingBottom: "5px"
		}

		var headingStyle = {
			textAlign: "center",
			color: "#444444",
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
				<PeopleDetailsLineItem person={star} />
			</div>
			<div class="outerContainer">
				<div class="innerInfo" style={divStyle}>
					<div class="titleRow" style={headingStyle}>
						Parents
					</div>
					<div>
						{mappedParentalRels}
					</div>
				</div>
				<div class="innerInfo" style={divStyle}>
					<div class="titleRow" style={headingStyle}>
						Pair Bonds
					</div>
					<div>
						{mappedPairBondRels}
					</div>
					<div class="buttonRow">
						<i class="fa fa-plus-square buttonSize" onClick={this.createPairBondRel}></i>
					</div>
				</div>
				<div class="innerInfo" style={divStyle}>
					<div class="titleRow" style={headingStyle}>
						Chronology
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
		</div>
		);
	}
}
