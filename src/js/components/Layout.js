import React from "react"
import { connect } from "react-redux"

import { fetchEvents } from "../actions/eventsActions"
import { fetchPairBondRels } from "../actions/pairBondRelsActions"
import { fetchParentalRels } from "../actions/parentalRelsActions"
import { fetchPeople } from "../actions/peopleActions"

import PeopleSearch from './peoplesearch/peoplesearch';

@connect()
export default class Layout extends React.Component {

	componentWillMount() {
		this.props.dispatch(fetchEvents());
		this.props.dispatch(fetchPairBondRels());
		this.props.dispatch(fetchParentalRels());
		this.props.dispatch(fetchPeople());
	}

	logIn = () => {

	}

	logOut = () => {

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
						  <a routerLink="/" class="navbar-brand">
							Family Genie <sup>&trade;</sup>
						  </a>
						</div>
					</li>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					{/*
					<li class="navbar-li-padding" [class.active]="router.isActive('/peoplesearch', true)">
					*/}
					<li class="navbar-li-padding">
						<a class="navbarright" routerLink="/peoplesearch">FAMILY LIST</a>
					</li>
					{/*
					<li *ngIf="this.authService.isLoggedIn()" class="navbar-li-padding" >
					*/}
					<li class="navbar-li-padding">
						<a class="navbarright" onClick={this.logOut}>LOG OUT</a>
					</li>
					{/*
					<li *ngIf="!this.authService.isLoggedIn()" class="navbar-li-padding" >*/}
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
