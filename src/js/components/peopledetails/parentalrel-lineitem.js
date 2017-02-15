import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';

import ParentalRelLineItemEdit from './parentalrel-lineitem-edit';
import { setParentalRel } from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		return {
			parent:
				store.people.people.find(function(p) {
					return p._id === ownProps.parentalRel.parent_id;
				}),
			parentalRel:
				ownProps.parentalRel,
		};
	},
	(dispatch) => {
		return {
			// get the parentalRel object that needs to appear in the modal
			setParentalRel: (parentalRel) => {
				dispatch(setParentalRel(parentalRel));
			},
		}
	}
)
export default class ParentalRelLineItem extends React.Component {
	constructor (props) {
		super(props);
		// this variable will store whether the modal window is open or not
		this.state = {modalIsOpen: false};
	}

	openModal = () => {
		// As well as setting the variable for the modal to open, pass the parentalRel that we want to show up in the modal window to the Store. The parentalrelLineItemEdit component that shows in the modal will grab the parentalRel from the store.
		this.props.setParentalRel(this.props.parentalRel);
		this.setState({modalIsOpen: true});
	}

	closeModal = () => {
		// this.props.closeModal();
		this.setState({modalIsOpen: false});
	}

	render = () => {

		const { parent, parentalRel, modalParentalRel } = this.props;
		const { modalIsOpen } = this.state;



		// check to see if the pairBondPerson exists, if not, then set the value to "Click to Edit" for the end user to see.
		const parentFName = ( parent ? parent.fName : "Click to Edit" );
		const parentLName = ( parent ? parent.lName : " " );

		// The idea here is that this page will show a list of parents that is uneditable. If they click on the parent, a modal will open that will allow them to edit that parentalRel record.
		if (parentalRel) {
			return (
				<div>
					<div class="infoRow">
						<div class="buttonCol" onClick={this.openModal}>
							<i class="fa fa-pencil-square-o button2"></i>
						</div>
						<div class="inner-name-div">
							<div class="nameCol" onClick={this.openModal}>
								<div class="relTypeWord">{parentFName}</div>
								<div class="relTypeWord">{parentLName}</div>
							</div>
							<div class="relTypeCol">
								<div class="relTypeWord ital">{parentalRel.subType}</div>
								<div class="relTypeWord ital">{parentalRel.relationshipType}
								</div>
							</div>
						</div>
					</div>
					{/* This modal is what opens when you click on one of the parent records that is displayed. The modalIsOpen variable is accessed via the Store, and is updated in the store, by the openModal call (and set to false in the closeModal call). The new state of the Store triggers a re-rendering, and the isOpen property of the modal is then true, so it displays. We also store the parentalRel record that should be opened in the modal in the Store, so it can be easily accessed */}
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
								Parental Relationship Edit
						</div>
						<div class="buffer-modal">
						</div>
						<ParentalRelLineItemEdit />
					</Modal>
				</div>)
		} else {
			return (<p>Loading Pair Bonds...</p>);
		}
	}
}
