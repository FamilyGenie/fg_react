import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';

import ParentalRelLineItemEdit from './parentalrel-lineitem-edit';
import { setParentalRel } from '../../actions/modalActions';

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

		// The idea here is that this page will show a list of parents that is uneditable. If they click on the parent, a modal will open that will allow them to edit that parentalRel record.
		if (parentalRel && parent) {
			return (
				<div>
					<div class="row person-item">
						<div class="col-xs-12">
							<p onClick={this.openModal}>
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
						<ParentalRelLineItemEdit />
						<div><p></p></div>
						<button onClick={this.closeModal}>Close</button>
					</Modal>
				</div>)
		} else {
			return (<p>Loading Pair Bonds...</p>);
		}
	}
}
