import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';

import PairBondRelLineItemEdit from './pairbondrel-lineitem-edit';
import { setPairBondRel } from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		// Since we are passing the person in from the parent object, just map the component's props to the props that have come in (for now).
		// console.log("in pairbondRel @connect, with: ", ownProps);
		// return ownProps;
		var pairBondPerson_id;
		// ownProps.person._id is the id of the person who is being edited in the personDetails page. Figure out if they are personOne or personTwo of the pairBond recorpairBondP, and set the variable pairBondPerson as the other id
		if (ownProps.person._id === ownProps.pairBondRel.personOne_id) {
			pairBondPerson_id = ownProps.pairBondRel.personTwo_id
		} else {
			pairBondPerson_id = ownProps.pairBondRel.personOne_id
		}
		return {
			pairBondPerson:
				store.people.people.find(function(p) {
					return p._id === pairBondPerson_id;
				}),
			pairBondRel:
				ownProps.pairBondRel,
			star:
				ownProps.person,
		};
	},
	(dispatch) => {
		return {
			// get the parentalRel object that needs to appear in the modal
			setPairBondRel: (pairBondRel) => {
				dispatch(setPairBondRel(pairBondRel));
			},
		}
	}
)
export default class PairBondRelLineItem extends React.Component {
	constructor (props) {
		super(props);
		// this variable will store whether the modal window is open or not
		this.state = {
			modalIsOpen: false,
		};
	}

	openModal = () => {
		// As well as setting the variable for the modal to open, pass the parentalRel that we want to show up in the modal window to the Store. The parentalrelLineItemEdit component that shows in the modal will grab the parentalRel from the store.
		this.props.setPairBondRel(this.props.pairBondRel);
		this.setState({modalIsOpen: true});
	}

	closeModal = () => {
		// this.props.closeModal();
		this.setState({modalIsOpen: false});
	}

	render = () => {

		const { pairBondRel, pairBondPerson, star } = this.props;
		const { modalIsOpen } = this.state;

		var modalStyle = {
			overlay: {
			position: 'fixed',
			top: 100,
			left: 100,
			right: 100,
			bottom: 100,
			}
		}
		var headingStyle = {
			textAlign: "center",
			color: "#333333",
			fontWeight: "bold",
			fontSize: "1.25em",
			marginBottom: 10,
		}

		// check to see if the pairBondPerson exists, if not, then set the value to "Click to Edit" for the end user to see.
		const pairBondPersonFName = ( pairBondPerson ? pairBondPerson.fName : "Click to Edit" );
		const pairBondPersonLName = ( pairBondPerson ? pairBondPerson.lName : " " );

		if (pairBondRel) {
			return (
				<div class="row person-item">
					<div class="col-xs-12">
						<p onClick={this.openModal}>
							{pairBondPersonFName} {pairBondPersonLName} {pairBondRel.relationshipType}
						</p>
					</div>
					{/* This modal is what opens when you click on one of the parent records that is displayed. The modalIsOpen variable is accessed via the Store, and is updated in the store, by the openModal call (and set to false in the closeModal call). The new state of the Store triggers a re-rendering, and the isOpen property of the modal is then true, so it displays. We also store the parentalRel record that should be opened in the modal in the Store, so it can be easily accessed */}
					<Modal
						isOpen={modalIsOpen}
						contentLabel="Modal"
						style={modalStyle}
						>
						{/* Everything between here and <ParentalRelLineItemEdit/> is the header of the modal that will open to edit the parental relationship info */}
						<div class="row">
							<div class="col-xs-12" style={headingStyle}>
								PairBond Relationship Edit
							</div>
						</div>
						<div class="row">
							<div class="col-xs-2 title bold">
								Person
							</div>
							<div class="col-xs-2 title bold">
								RelationshipType
							</div>
							<div class="col-xs-2 title bold">
								StartDate
							</div>
							<div class="col-xs-2 title bold">
								EndDate
							</div>
						</div>
						<PairBondRelLineItemEdit pairBondRel={pairBondRel} star={star}/>
						<div><p></p></div>
						<button onClick={this.closeModal}>Close</button>
					</Modal>
				</div>)
		} else {
			return (<p>Loading Pair Bonds...</p>);
		}
	}
}
