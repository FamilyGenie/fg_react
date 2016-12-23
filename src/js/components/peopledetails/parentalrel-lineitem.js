import React from 'react';
import { connect } from "react-redux";
import { hashHistory, Link } from 'react-router'
import Modal from 'react-modal';

import ParentalRelLineItemEdit from './parentalrel-lineitem-edit';
import { openModal, openParentalRelModal, closeParentalRelModal } from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		// console.log("in parentalrel lineitem @connect, with store:", store, ownProps);
		return {
			parent:
				store.people.people.find(function(p) {
					return p._id === ownProps.parentalRel.parent_id;
				}),
			parentalRel:
				ownProps.parentalRel,
			modalIsOpen:
				store.modal.modalParentalRelIsOpen,
			modalParentalRel:
				store.modal.parentalRel
		};
	},
	(dispatch) => {
		return {
			// get the parentalRel object that needs to appear in the modal
			openModal: (parentalRel) => {
				dispatch(openParentalRelModal(parentalRel));
			},
			closeModal: () => {
				dispatch(closeParentalRelModal());
			}
		}
	}
)
export default class ParentalRelLineItem extends React.Component {

	openModal = () => {
		// console.log("in openModal with props: ", this.props.parent.fName, this.props.parentalRel._id);
		// call OpenModal with the parentalRel that we want to show up in the modal window
		this.props.openModal(this.props.parentalRel);
	}

	closeModal = () => {
		this.props.closeModal();
	}

	openRecord = () => {
		hashHistory.push('/parentalreledit/' + this.props.parentalRel._id);

	}

	render = () => {

		// console.log("in ParentalRelLineItem Render with: ", this.props);
		const { parent, parentalRel, modalIsOpen, modalParentalRel } = this.props;

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

		if (parentalRel) {
			return (
				<div>
					<div class="row person-item">
						<div class="col-xs-12">
							<p onClick={this.openModal.bind(this)}>
								{parent.fName} {parent.lName} {parentalRel.subType} {parentalRel.relationshipType}
							</p>
						</div>
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
								Parental Relationship Edit
							</div>
						</div>
						<div class="row">
							<div class="col-xs-2 title bold">
								Parent Name
							</div>
							<div class="col-xs-2 title bold">
								Relationship
							</div>
							<div class="col-xs-2 title bold">
								SubType
							</div>
							<div class="col-xs-2 title bold">
								StartDate
							</div>
							<div class="col-xs-2 title bold">
								EndDate
							</div>
						</div>
						<ParentalRelLineItemEdit/>
						<div><p></p></div>
						<button onClick={this.closeModal}>Close</button>
					</Modal>
				</div>)
		} else {
			return (<p>Loading Pair Bonds...</p>);
		}
	}
}
