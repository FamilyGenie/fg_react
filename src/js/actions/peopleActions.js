import axios from 'axios';

import { getAxiosConfig } from './actionFunctions';
import config from '../config.js';

export function fetchPeople() {

	return function(dispatch) {
		dispatch({type: "FETCH_PEOPLE"});
		axios.get(config.api_url + "/api/v2/people", getAxiosConfig())
			.then((response) => {
				dispatch({type: "FETCH_PEOPLE_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "FETCH_PEOPLE_REJECTED", payload: err})
			})
	}
}

export function createPerson(fName, mName, lName, sexAtBirth, notes) {

	const body = {
		object: {
			fName,
			mName,
			lName,
			sexAtBirth,
			notes
		}
	};

	// console.log('in createPerson: ', ac);
	return (dispatch) => {
		dispatch({type: "CREATE_PERSON"});
		axios.post(config.api_url + "/api/v2/person/create", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "CREATE_PERSON_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "CREATE_PERSON_REJECTED", payload: err})
			})
	}
}

export function updatePerson(_id, field, value) {
	const body = {
		object: {
			_id,
			field,
			value
		}
	};
	return (dispatch) => {
		dispatch({type: "UPDATE_PERSON"});
		axios.post(config.api_url + "/api/v2/person/update", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "UPDATE_PERSON_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "UPDATE_PERSON_REJECTED", payload: err})
			})
	}
}

export function deletePerson(_id) {
/* when you delete a person, you also have to delete
	1. All events that are related to them
	2. All pairBonds that they are a part of
	3. All parentalRels where they are the parent or child
*/
	var body;
	return (dispatch) => {
		dispatch({type: "DELETE_PERSON"});

		// this is the body to send to the delete event api
		body = {
			object: {
				field: "person_id",
				value: _id
			}
		};

		/*************
		TODO: can all these be changed to just call the action (will also need to import it at the top). Something like:
		import { deleteEvent } from '../actions/eventsActions';
		dispatch(deleteEvent('person_id', _id));
		**************/
		dispatch({type: "DELETE_EVENT"});
		axios.post(config.api_url + "/api/v2/event/delete", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "DELETE_EVENT_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_EVENT_REJECTED", payload: err})
			})

		// to delete the person from all pairbondRels, have to delete where they are PersonOne and PersonTwo
		body = {
			object: {
				field: "personOne_id",
				value: _id
			}
		};
		dispatch({type: "DELETE_PAIRBONDREL"});
		axios.post(config.api_url + "/api/v2/pairbondrel/delete", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "DELETE_PAIRBONDREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_PAIRBONDREL_REJECTED", payload: err})
			})

		body = {
			object: {
				field: "personTwo_id",
				value: _id
			}
		};
		dispatch({type: "DELETE_PAIRBONDREL"});
		axios.post(config.api_url + "/api/v2/pairbondrel/delete", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "DELETE_PAIRBONDREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_PAIRBONDREL_REJECTED", payload: err})
			})

		// next, delete all parental rels where this person is the parent
		body = {
			object: {
				field: "parent_id",
				value: _id
			}
		};
		dispatch({type: "DELETE_PARENTALREL"});
		axios.post(config.api_url + "/api/v2/parentalrel/delete", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "DELETE_PARENTALREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_PARENTALREL_REJECTED", payload: err})
			})

		// now, delete all parentalrels where this person is the child
		body = {
			object: {
				field: "child_id",
				value: _id
			}
		};
		dispatch({type: "DELETE_PARENTALREL"});
		axios.post(config.api_url + "/api/v2/parentalrel/delete", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "DELETE_PARENTALREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_PARENTALREL_REJECTED", payload: err})
			})

		// last, delete the person
		body = {
			object: {
				_id,
			}
		};
		axios.post(config.api_url + "/api/v2/person/delete", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "DELETE_PERSON_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_PERSON_REJECTED", payload: err})
			})
	}

}
