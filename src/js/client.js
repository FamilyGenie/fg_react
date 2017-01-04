import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './components/Layout'
import PeopleSearch from './components/peoplesearch/peoplesearch';
import PeopleDetails from './components/peopledetails/peopledetails';
import ParentalRelsLineItemEdit from './components/peopledetails/parentalrel-lineitem-edit';
import store from './store';
import GedcomImport from './components/gedcomimport/upload-gedcom';
import StagedPeopleSearch from './components/gedcomimport/staged-peoplesearch';

const app = document.getElementById('app');

ReactDOM.render(<Provider store={store}>

	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={PeopleSearch}></IndexRoute>
			<Route path="/peopledetails(/:_id)" name="People Details" component={PeopleDetails}></Route>
			<Route path="/parentalreledit(/:_id)" name="Parental Rel Edit" component={ParentalRelsLineItemEdit}></Route>
			<Route path='/gedcomimport' name='GedcomImport' component={GedcomImport}></Route>
			<Route path='/stagedpeoplesearch' name='StagedPeopleSearch' component={StagedPeopleSearch}></Route>
		</Route>
	</Router>
</Provider>, app);
