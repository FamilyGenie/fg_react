import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import FamilyMap from './components/familymap/familymap';
import Layout from './components/Layout'
import PeopleSearch from './components/peoplesearch/peoplesearch';
import PeopleDetails from './components/peopledetails/peopledetails';
import ParentalRelsLineItemEdit from './components/peopledetails/parentalrel-lineitem-edit';
import store from './store';
import GedcomImport from './components/gedcomimport/upload-gedcom';
import StagedPeopleSearch from './components/gedcomimport/staged-peoplesearch';
import StagedPeopleDetails from './components/gedcomimport/staged-peopledetails';
import TestNewPerson from './components/testPage';
import NewPerson from './components/newperson';

const app = document.getElementById('app');

ReactDOM.render(<Provider store={store}>

	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={PeopleSearch}></IndexRoute>
			<Route path='/peopledetails(/:star_id)' name='People Details' component={PeopleDetails}></Route>
			<Route path="/familymap(/:star_id)" name='Family Map' component={FamilyMap}></Route>
			<Route path='/gedcomimport' name='GedcomImport' component={GedcomImport}></Route>
			<Route path='/stagedpeoplesearch' name='Staged People Search' component={StagedPeopleSearch}></Route>
			<Route path='/stagedpeopledetails(/:_id)' name='Staged People Details' component={StagedPeopleDetails}></Route>
      <Route path='/testpage' name='Test Page' component={TestNewPerson}></Route>
      <Route path='/newperson(/:_id)' name='New Person' component={NewPerson}></Route>
		</Route>
	</Router>
</Provider>, app);
