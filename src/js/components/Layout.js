import React from "react"
import { connect } from "react-redux"

import { fetchEvents } from "../actions/eventsActions"
import { fetchPairBondRels } from "../actions/pairBondRelsActions"
import { fetchParentalRels } from "../actions/parentalRelsActions"
import { fetchPeople } from "../actions/peopleActions"
import { fetchStagedPeople } from '../actions/stagedPeopleActions';

import PeopleSearch from './peoplesearch/peoplesearch';

@connect()
export default class Layout extends React.Component {

	componentWillMount() {
		this.props.dispatch(fetchEvents());
		this.props.dispatch(fetchPairBondRels());
		this.props.dispatch(fetchParentalRels());
		this.props.dispatch(fetchPeople());
		this.props.dispatch(fetchStagedPeople());
	}

	render() {
		return <div>
			{this.props.children}
		</div>
	}
}
