import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';

import PairBondRelLineItemEdit from './pairbondrel-lineitem-edit';
import { setPairBondRel } from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		// Since we are passing the person in from the parent object, just map the component's props to the props that have come in (for now).
		var pairBondPerson_id;
		var star;
		// ownProps.person._id is the id of the person who is being edited in the personDetails page. Figure out if they are personOne or personTwo of the pairBond recorpairBondP, and set the variable pairBondPerson as the other id

		// If there is no person passed, then don't set anything. I'm not sure if this is the right thing to do. Experimenting.
		if (ownProps.person) {
			if (ownProps.person._id === ownProps.pairBondRel.personOne_id) {
				pairBondPerson_id = ownProps.pairBondRel.personTwo_id;
			} else {
				pairBondPerson_id = ownProps.pairBondRel.personOne_id
			}
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

		// check to see if the pairBondPerson exists, if not, then set the value to "Click to Edit" for the end user to see.
		const pairBondPersonFName = ( pairBondPerson ? pairBondPerson.fName : "Click to Edit" );
		const pairBondPersonLName = ( pairBondPerson ? pairBondPerson.lName : " " );

		if (pairBondRel && star) {
			return (
				<div class="infoRow">
					<div class="buttonCol" onClick={this.openModal}>
						<i class="fa fa-pencil-square-o button2"></i>
					</div>
					<div class="inner-name-div">
						<div class="nameCol" onClick={this.openModal}>
								<div class="relTypeWord">{pairBondPersonFName}</div>
								<div class="relTypeWord">{pairBondPersonLName}</div>
						</div>
						<div class="relTypeCol">
							<div class="relTypeWord ital">{pairBondRel.relationshipType}</div>
						</div>
					</div>
					{/* This modal is what opens when you click on one of the pairbond records that is displayed. The modalIsOpen variable is accessed via the state, by the openModal call (and set to false in the closeModal call). When set, the new state triggers a re-rendering, and the isOpen property of the modal is then true, so it displays. We also store the pairBondRel record that should be opened in the modal in the Store, so it can be accessed */}
					<Modal
						className="detail-modal"
						isOpen={modalIsOpen}
						contentLabel="Modal"
						>
						{/* Everything between here and <ParentalRelLineItemEdit/> is the header of the modal that will open to edit the parental relationship info */}
						<div class="modalClose">
							<i class="fa fa-window-close-o fa-2x" aria-hidden="true" onClick={this.closeModal}></i>
						</div>
						<div class="modalH">
								Pairbond Relationship Edit
						</div>
						<div class="buffer-modal">
						</div>
						<PairBondRelLineItemEdit
							pairBondRel={pairBondRel}
							star={star}
							closeModal={this.closeModal}/>
						<div><p></p></div>
					</Modal>
				</div>)
		} else {
			return (<p>Loading Pair Bonds...</p>);
		}
	}
}
