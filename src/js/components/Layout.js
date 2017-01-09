import React from "react";
import { connect } from "react-redux";
import { hashHistory } from 'react-router';


import { fetchEvents } from "../actions/eventsActions";
import { fetchPairBondRels } from "../actions/pairBondRelsActions";
import { fetchParentalRels } from "../actions/parentalRelsActions";
import { fetchPeople } from "../actions/peopleActions";
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

	logIn = () => {

	}

	logOut = () => {

	}

	goToPeopleSearch = () => {
		hashHistory.push('/');
	}

	goToPeopleStaged = () => {
		hashHistory.push('/stagedpeoplesearch/');
	}

	render() {
		return (
		<div>
			<nav class="navbar navbar-default navbar-fixed-top">
				<ul id="logoname" class="nav navbar-nav navbar-left">
					<li>
						<img class="navbarleft lampimg" src="../assets/images/lamp.png"/>
					</li>
				</ul>
				<ul class="nav navbar-nav navbar-left">
					<li class="navbar-li-padding">
						<div class="navbar-header">
						  <a class="navbar-brand">
							Family Genie <sup>&trade;</sup>
						  </a>
						</div>
					</li>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li class="navbar-li-padding">
						<a class="navbarright" onClick={this.goToPeopleSearch}>FAMILY LIST</a>
					</li>
					<li class="navbar-li-padding">
						<a class="navbarright" onClick={this.goToPeopleStaged}>STAGED LIST</a>
					</li>
					<li class="navbar-li-padding">
						<a class="navbarright" onClick={this.logOut}>LOG OUT</a>
					</li>
					<li class="navbar-li-padding" >
						<a class="navbarright" onClick={this.logIn}>LOG IN</a>
					</li>
				</ul>
			</nav>
			<div>
				{this.props.children}
			</div>
			<footer class="footer navbar-fixed-bottom">
				<div class="container footer-container">
					copyright &copy;2016 PsychoGenealogical Research
				</div>
			</footer>
		</div>
		);
	}
}
