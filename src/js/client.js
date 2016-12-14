import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './components/Layout'
import PeopleSearch from './components/peoplesearch/peoplesearch';
import PeopleDetails from './components/peopledetails/peopledetails';
import store from './store'

const app = document.getElementById('app');

ReactDOM.render(<Provider store={store}>

	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={PeopleSearch}></IndexRoute>
			<Route path="/peopledetails(/:_id)" name="People Details" component={PeopleDetails}></Route>
		</Route>
	</Router>
</Provider>, app);
