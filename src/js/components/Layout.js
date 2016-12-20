import React from "react"
import { connect } from "react-redux"

import { fetchEvents } from "../actions/eventsActions"
import { fetchPeople } from "../actions/peopleActions"

import PeopleSearch from './peoplesearch/peoplesearch';

@connect()
export default class Layout extends React.Component {

	componentWillMount() {
		console.log("in layout.js, componentWillMount, with props: ", this.props);
		this.props.dispatch(fetchPeople());
		this.props.dispatch(fetchEvents());
	}

	render() {
		console.log("in layout.js, with props: ", this.props);
		return <div>
			{this.props.children}
		</div>
	}
}
