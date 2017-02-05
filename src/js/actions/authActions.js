import axios from 'axios';
import cookie from 'react-cookie';
import { hashHistory } from 'react-router';

import { fetchEvents } from '../actions/eventsActions';
import { fetchPairBondRels } from '../actions/pairBondRelsActions';
import { fetchParentalRels } from '../actions/parentalRelsActions';
import { fetchPeople } from "../actions/peopleActions";
import { fetchStagedPeople } from '../actions/stagedPeopleActions';
import { fetchStagedEvents } from '../actions/stagedEventActions';
// import { fetchStagedParentalRels } from '../actions/stagedParentalRelActions';

import config from '../config.js';

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
	headers: {'x-access-token': fgtoken}
};

export function login(username, password) {
	const body = {
		username,
		password
	};
	return (dispatch) => {
		dispatch({type: "LOGIN"});
		axios.post(config.api_url + "/api/v1/login", body, axiosConfig)
			.then((response) => {
				// if the login is successful, then save the cookie for the app, and call the dispatch to retrieve all the data.
				cookie.save('fg-access-token', response.data.token);
				debugger;
				dispatch(fetchPeople());
				dispatch(fetchEvents());
				dispatch(fetchPairBondRels());
				dispatch(fetchParentalRels());
				dispatch(fetchStagedPeople());
				dispatch(fetchStagedEvents());
				// this.props.dispatch(fetchStagedParentalRels());

				dispatch({type: "LOGIN_SUCCESSFUL", payload: response.data});
				debugger;
				hashHistory.push('/');

			})
			.catch((err) => {
				dispatch({type: "LOGIN_ERROR", payload: err})
			})
	}
}

// when logout is called, remove the cookie with the token, and clear all the data
export function logout() {
	return (dispatch) => {
		cookie.remove('fg-access-token');
		dispatch({type: 'CLEAR_PEOPLE'});
		dispatch({type: 'CLEAR_EVENTS'});
		dispatch({type: 'CLEAR_PARENTALRELS'});
		dispatch({type: 'CLEAR_PAIRBONDRELS'});
		dispatch({type: 'CLEAR_STAGEDPEOPLE'});
		dispatch({type: 'CLEAR_STAGEDEVENTS'});

		dispatch({type: 'LOGOUT_SUCCESSFUL'});
	}
}
