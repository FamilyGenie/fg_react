import React from "react"
import { connect } from "react-redux"

import { fetchUser } from "../actions/userActions"
import { fetchPeople } from "../actions/peopleActions"

import PeopleSearch from './peoplesearch/peoplesearch';

@connect()
export default class Layout extends React.Component {

	componentWillMount() {
		this.props.dispatch(fetchPeople());
	}

	render() {
		return <div>
			{this.props.children}
		</div>
	}
}
