import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';

import { openModal, openParentalRelModal, closeParentalRelModal } from '../../actions/modalActions';

@connect(
	(store, ownProps) => {
		// Since we are passing the person in from the parent object, just map the component's props to the props that have come in (for now).
		// console.log("in parentalrel lineitem @connect, with store:", store.people.people, ownProps);
		console.log("in parentalrel @connect with:",
				store.people.people.find(function(p) {
					return p._id === ownProps.parentalRel.parent_id;
				}));
		return {
			parent:
				store.people.people.find(function(p) {
					return p._id === ownProps.parentalRel.parent_id;
				}),
			parentalRel:
				ownProps.parentalRel,
			modalIsOpen:
				store.modal.modalParentalRelIsOpen
		};
	},
	(dispatch) => {
		return {
			openModal: () => {
				dispatch(openParentalRelModal());
			},
			closeModal: () => {
				dispatch(closeParentalRelModal());
			}
		}
	}
)
export default class ParentalRelLineItem extends React.Component {

	openModal = () => {
		this.props.openModal();
	}

	closeModal = () => {
		this.props.closeModal();
	}

	render = () => {

		// console.log("in ParentalRelLineItem with: ", this.props);
		const { parent, parentalRel, modalIsOpen } = this.props;

		var modalStyle = {
			overlay: {
			position: 'fixed',
			top: 100,
			left: 100,
			right: 100,
			bottom: 100,
			}
		}

		if (parentalRel) {
			return (
				<div>
					<div class="row person-item">
						<p onClick={this.openModal}>
							{parent.fName} {parent.lName} {parentalRel.subType}
						</p>
					</div>
					<Modal
						isOpen={modalIsOpen}
						contentLabel="Modal"
						style={modalStyle}
						>
						<h1>Parental Rel Modal</h1>
						<p>Etc. {modalIsOpen}</p>
						<button onClick={this.closeModal}>Close Modal</button>
					</Modal>
				</div>)
		} else {
			return (<p>Loading Pair Bonds...</p>);
		}
	}
}
