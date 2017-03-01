import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import { fetchEvents } from '../actions/eventsActions';
import { fetchPairBondRels } from '../actions/pairBondRelsActions';
import { fetchParentalRels } from '../actions/parentalRelsActions';
import { fetchPeople } from "../actions/peopleActions";
import { fetchStagedPeople } from '../actions/stagedPeopleActions';
import { fetchStagedEvents } from '../actions/stagedEventActions';
import { fetchStagedParentalRels } from '../actions/stagedParentalRelActions';
import { fetchStagedPairBondRels } from '../actions/stagedPairBondRelActions';
import HistoryBar from './historybar/index';
import Sidebar from 'react-sidebar';
import { logout } from '../actions/authActions';

import PeopleSearch from './peoplesearch/peoplesearch';

@connect(
	(store, ownProps) => {
		return store;
	}
)
export default class Layout extends React.Component {

	componentWillMount() {
		this.props.dispatch(fetchPeople());
		this.props.dispatch(fetchEvents());
		this.props.dispatch(fetchPairBondRels());
		this.props.dispatch(fetchParentalRels());
		this.props.dispatch(fetchStagedPeople());
		this.props.dispatch(fetchStagedEvents());
    this.props.dispatch(fetchStagedParentalRels());
    this.props.dispatch(fetchStagedPairBondRels());
	}

	logIn = () => {
  		hashHistory.push('/auth/login');
	}

	logOut = () => {
		this.props.dispatch(logout());
		hashHistory.push('/auth/login');
	}

	goToPeopleSearch = () => {
		hashHistory.push('/');
	}

	goToPeopleStaged = () => {
		hashHistory.push('/stagedpeoplesearch/');
	}

  goToImport = () => {
    hashHistory.push('/importhome/');
  }

  goToChronology = () => {
    hashHistory.push('/chronology/');
  }

	// <HistoryBar/>

	render() {
		return (
		<div>
			<nav class="navbar navbar-default">
				<div class="container-fluid">
			    <div class="navbar-header">
			      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
			        <span class="sr-only">Toggle navigation</span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			      </button>
						<a class="navbar-brand" onClick={this.goToPeopleSearch}>
						Family Genie <sup>&trade;</sup>
						</a>
			    </div>
			    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

						<ul class="nav navbar-nav navbar-right">
      				<li>
						    <a class="navbarright" onClick={this.goToChronology}> CHRONOLOGY </a>
					    </li>
							<li>
		            <a class="navbarright" onClick={this.goToImport}>IMPORT</a>
		          </li>
		          <li>
		            <a class="navbarright" onClick={this.goToPeopleSearch}>FAMILY LIST</a>
		          </li>
		          <li>
		            <a class="navbarright" onClick={this.goToPeopleStaged}>STAGED LIST</a>
		          </li>
		          <li>
		            <a class="navbarright" onClick={this.logOut}>LOG OUT</a>
		          </li>
		          <li>
		            <a class="navbarright" onClick={this.logIn}>LOG IN</a>
		          </li>
							<li>
								<i class="fa fa-question-circle-o fa-2x" aria-hidden="true"></i>
							</li>
		        </ul>
			    </div>
			  </div>
			</nav>
			<div class="layout">
				<div class="all-content">
					{this.props.children}
				</div>
			</div>
			<footer class="footer navbar-fixed-bottom">
					PsychoGenealogical Research 2017 &copy;
			</footer>
		</div>
		);
	}
}
