import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import store from './store';

import EnsureLoggedInContainer from './components/auth/ensure-loggedin-container';
import GedcomImport from './components/gedcomimport/upload-gedcom';
import ImportDashboard from './components/gedcomimport/import-home';
import Layout from './components/Layout'
import Login from './components/auth/login';
import PeopleSearch from './components/peoplesearch/peoplesearch';
import PeopleDetails from './components/peopledetails/peopledetails';
import ParentalRelsLineItemEdit from './components/peopledetails/parentalrel-lineitem-edit';
import StagedPeopleSearch from './components/gedcomimport/people/staged-peoplesearch';
import StagedPeopleDetails from './components/gedcomimport/people/staged-peopledetails';
import StagedPairBondRelSearch from './components/gedcomimport/pairbondrels/staged-pairbondrelsearch';
import StagedParentalRelSearch from './components/gedcomimport/parentalrels/staged-parentalrelsearch';
import Chronology from './components/chronology/chronology';
import ResetDatabase from './components/gedcomimport/reset-db';
import OneMap from './components/familymap/onemap';
import MegaMap from './components/familymap/megamap';

const app = document.getElementById('app');

ReactDOM.render(<Provider store={store}>

	<Router history={hashHistory}>
		<Route path='/' component={Layout}>

			<Route path='/auth/login' name='Login' component={Login}></Route>

			// put every route that we want to require login for inside this route
			<Route component={EnsureLoggedInContainer}>

				<IndexRoute component={PeopleSearch}></IndexRoute>

				<Route path='/peopledetails(/:star_id)' name='People Details' component={PeopleDetails}></Route>

				<Route path='/gedcomimport' name='GedcomImport' component={GedcomImport}></Route>

				<Route path='/stagedpeoplesearch' name='Staged People Search' component={StagedPeopleSearch}></Route>

				<Route path='/stagedpeopledetails(/:_id)' name='Staged People Details' component={StagedPeopleDetails}></Route>

				<Route path='/stagedpairbondrelsearch' name='Staged PairBond Relationships' component={StagedPairBondRelSearch}></Route>

				<Route path='/stagedparentalrelsearch' name='Staged Parental Relationship Comparison' component={StagedParentalRelSearch}></Route>

	      		<Route path='/chronology' name='Chronology' component={Chronology}></Route>

	      		<Route path='/onemap(/:star_id)' name='OneMap' component={OneMap}></Route>

	      		<Route path='/megamap(/:star_id)' name='MegaMap' component={MegaMap}></Route>


	      		<Route path='/importhome' name='Import Dashboard' component={ImportDashboard}></Route>

	      		<Route path='/resetdatabase' name='Reset Database' component={ResetDatabase}></Route>

	      	</Route>

		</Route>
	</Router>
</Provider>, app);
