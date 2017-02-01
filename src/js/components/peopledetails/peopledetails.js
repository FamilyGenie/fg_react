import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import EventLineItem from './event-lineitem';
import PairBondRelLineItem from './pairbondrel-lineitem';
import ParentalRelLineItem from './parentalrel-lineitem';
import ParentalRelLineItemEdit from './parentalrel-lineitem-edit';
import PeopleDetailsLineItem from './peopledetails-lineitem';
import { createEvent } from '../../actions/eventsActions';
import { createPerson } from '../../actions/peopleActions';
import { createPairBondRel } from '../../actions/pairBondRelsActions';
import { createParentalRel } from '../../actions/parentalRelsActions';
import { closeModal, openModal} from '../../actions/modalActions';
import HistoryBar from '../historybar/historybar';

@connect(
	(store, ownProps) => {
		return {
			star:
				store.people.people.find(function(p) {
					return p._id === ownProps.params.star_id;
				}),
			events:
				store.events.events.filter(function(e) {
					return e.person_id === ownProps.params.star_id;
				}),
			// get all pair bonds where the star of the page is either personOne or personTwo
			pairBondRels:
				store.pairBondRels.pairBondRels.filter(function(r) {
					return (r.personOne_id === ownProps.params.star_id ||
						r.personTwo_id === ownProps.params.star_id);
				}),
			// only get the parental rels where the star of the page is the child in the relationship.
			parentalRels:
				store.parentalRels.parentalRels.filter(function(t) {
					return (t.child_id === ownProps.params.star_id);
				}),
			modalIsOpen:
				store.modal.modalIsOpen
		};
	},
	(dispatch) => {
		return {
			createEvent: (star_id) => {
				dispatch(createEvent("", null, star_id, "", "", "", "", ""));
			},
			createPairBondRel: (star_id) => {
				dispatch(createPairBondRel(star_id, null, "", "", "", "", ""));
			},
			createParentalRel: (star_id) => {
				dispatch(createParentalRel(star_id, null, "", "", "", "", "", ""));
			},
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

	createPairBondRel = () => {
		this.props.createPairBondRel(this.props.star._id);
	}

	createParentalRel = () => {
		this.props.createParentalRel(this.props.star._id);
	}

	createEvent = () => {
		this.props.createEvent(this.props.star._id);
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

		return (
		<div class="main-detail" ref={(ref) => this._div = ref}>
			<div class="header-div">
				<h1 class="family-header">Personal Connections</h1>
			</div>
			<HistoryBar/>
			<div id="detail-name">
				<PeopleDetailsLineItem person={star} />
			</div>
			<div class="buffer-line">
			</div>
			<div class="outerContainer">
				<div class="parents-relationships">
					<div class="innerInfo">
						<div class="titleRow">
							<div class="blank-person-header">
							</div>
							<p class="detail-title">Parents</p>
							<div class="buttonSize">
								<i class="fa-plus-square fa" onClick={this.createParentalRel}>
								</i>
							</div>
						</div>
						<div class="buffer-div">
						</div>
						<div>
							{mappedParentalRels}
						</div>
				</div>

				<div class="innerInfo">
					<div class="titleRow">
						<div class="blank-person-header">
						</div>
						<p class="detail-title">Pair Bonds</p>
						<div class="buttonSize">
							<i class="fa-plus-square fa" onClick={this.createPairBondRel}></i>
						</div>
					</div>
					<div class="buffer-div">
					</div>
					<div>
						{mappedPairBondRels}
					</div>
				</div>
				</div>
				<div class="chronology-div">
					<div class="inner-chronology">
						<div class="titleRow">
							<div class="blank-person-header">
							</div>
							<p class="detail-title">Chronology</p>
							<div class="buttonSize">
								<i class="fa-plus-square fa"
								onClick={this.createEvent}>
								</i>
							</div>
						</div>
						<div class="buffer-div">
						</div>
						<div>
							{mappedEvents}
						</div>
					</div>
				</div>
			</div>
		</div>
		);
	}
	componentDidMount() {
		this._div.scrollTop = 0;
	}
}
