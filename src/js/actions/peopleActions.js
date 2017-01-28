import axios from "axios";
import cookie from "react-cookie";

import config from "../config.js";

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
	headers: {'x-access-token': fgtoken}
};

export function fetchPeople() {

	return function(dispatch) {
		dispatch({type: "FETCH_PEOPLE"});
		axios.get(config.api_url + "/api/v2/people", axiosConfig)
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
	return (dispatch) => {
		dispatch({type: "CREATE_PERSON"});
		axios.post(config.api_url + "/api/v2/person/create", body, axiosConfig)
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
		axios.post(config.api_url + "/api/v2/person/update", body, axiosConfig)
			.then((response) => {
				dispatch({type: "UPDATE_PERSON_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "UPDATE_PERSON_REJECTED", payload: err})
			})
	}
}

export function deletePerson(_id) {

	const body = {
		object: {
			_id,
		}
	};

	return (dispatch) => {
		dispatch({type: "DELETE_PERSON"});
		axios.post(config.api_url + "/api/v2/person/delete", body, axiosConfig)
			.then((response) => {
				dispatch({type: "DELETE_PERSON_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_PERSON_REJECTED", payload: err})
			})
	}

}
