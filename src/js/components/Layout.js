import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import { fetchEvents } from '../actions/eventsActions';
import { fetchPairBondRels } from '../actions/pairBondRelsActions';
import { fetchParentalRels } from '../actions/parentalRelsActions';
import { fetchPeople } from "../actions/peopleActions";
import { fetchStagedPeople } from '../actions/stagedPeopleActions';
import { fetchStagedEvents } from '../actions/stagedEventActions';
import HistoryBar from './historybar/index';
import Sidebar from 'react-sidebar';
// import { fetchStagedParentalRels } from '../actions/stagedParentalRelActions';
import { logout } from '../actions/authActions';

import PeopleSearch from './peoplesearch/peoplesearch';

@connect(
	(store, ownProps) => {
		return store;
	}
)
export default class Layout extends React.Component {
	constructor (props) {
		super(props);
		// this variable will store whether the modal window is open or not
		this.state = {historyBarShowing: false};
	}
	componentWillMount() {
		this.props.dispatch(fetchPeople());
		this.props.dispatch(fetchEvents());
		this.props.dispatch(fetchPairBondRels());
		this.props.dispatch(fetchParentalRels());
		this.props.dispatch(fetchStagedPeople());
		this.props.dispatch(fetchStagedEvents());
		// this.props.dispatch(fetchStagedParentalRels());
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
	toggleSideBar = () => {
		if(this.state.historyBarShowing === false) {
			$("#allContent").css({"width": "80%"});
			$("#history").css({"width": "20%"});
			this.setState({historyBarShowing: true});
		}
		if (this.state.historyBarShowing === true) {
			$("#history").css({"width": "0"});
			$("#allContent").css({"width": "100%"});
			this.setState({historyBarShowing: false});
		}
	}


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
								<i class="fa fa-question-circle-o fa-2x question" aria-hidden="true" onClick={this.toggleSideBar}></i>
							</li>
		        </ul>
			    </div>
			  </div>
			</nav>
			<div class="layout">
				<div class="allContent" id="allContent">
					{this.props.children}
				</div>
        <div class="mainHistory" id="history">
          <div class="help-menu">
            <div class="help-header">
              <div class="blank-person-header">
              </div>
              <h3 class="history-title-1">Help Menu</h3>
              <div class="help-close">
              </div>
            </div>
          </div>
          <div class="history-context">
            <h3 class="history-title-2">Your History</h3>
            <div class="histories">
              <div class="history">
              </div>
              <div class="history">
              </div>
              <div class="history">
              </div>
            </div>
          </div>
        </div>
			</div>
			<footer class="footer navbar-fixed-bottom">
					PsychoGenealogical Research 2017 &copy;
			</footer>
		</div>
		);
	}
}
