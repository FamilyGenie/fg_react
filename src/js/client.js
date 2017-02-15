import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import store from './store';

import FamilyMap from './components/familymap/familymap';
import GedcomImport from './components/gedcomimport/upload-gedcom';
import ImportDashboard from './components/gedcomimport/import-home';
import Layout from './components/Layout'
import Login from './components/auth/login';
import PeopleSearch from './components/peoplesearch/peoplesearch';
import PeopleDetails from './components/peopledetails/peopledetails';
import ParentalRelsLineItemEdit from './components/peopledetails/parentalrel-lineitem-edit';
import StagedPeopleSearch from './components/gedcomimport/staged-peoplesearch';
import StagedPeopleDetails from './components/gedcomimport/staged-peopledetails';
import StagedParentalRels from './components/gedcomimport/staged-parentalrels';
import Chronology from './components/chronology/chronology';
import HistoryBar from './components/historybar/index';

const app = document.getElementById('app');

ReactDOM.render(<Provider store={store}>

	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={PeopleSearch}></IndexRoute>
			<Route path='/peopledetails(/:star_id)' name='People Details' component={PeopleDetails}></Route>
			<Route path="/familymap(/:star_id)" name='Family Map' component={FamilyMap}></Route>
			<Route path='/gedcomimport' name='GedcomImport' component={GedcomImport}></Route>
			<Route path='/stagedpeoplesearch' name='Staged People Search' component={StagedPeopleSearch}></Route>
			<Route path="/stagedpeopledetails(/:_id)" name="Staged People Details" component={StagedPeopleDetails}></Route>
			<Route path="/stagedparentalrels(/:_id)" name="Staged Parental Relationships" component={StagedParentalRels}></Route>
			<Route path='/auth/login' name='Login' component={Login}></Route>
      <Route path="/chronology" name="Chronology" component={Chronology}></Route>
      <Route path='/importhome' name='Import Dashboard' component={ImportDashboard}></Route>
		</Route>
	</Router>
</Provider>, app);
