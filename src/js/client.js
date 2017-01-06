import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import FamilyMap from './components/familymap/familymap';
import Layout from './components/Layout'
import PeopleSearch from './components/peoplesearch/peoplesearch';
import PeopleDetails from './components/peopledetails/peopledetails';
import ParentalRelsLineItemEdit from './components/peopledetails/parentalrel-lineitem-edit';
import Test from './components/test';
import store from './store'

const app = document.getElementById('app');

ReactDOM.render(<Provider store={store}>

	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={PeopleSearch}></IndexRoute>
			<Route path="/peopledetails(/:star_id)" name="People Details" component={PeopleDetails}></Route>
			<Route path="/familymap(/:star_id)" name="Family Map" component={FamilyMap}></Route>
			<Route path="/test" name="Test" component={Test}></Route>
		</Route>
	</Router>
</Provider>, app);
