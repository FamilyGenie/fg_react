import axios from "axios";
import cookie from "react-cookie";

import config from "../config.js";

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
	headers: {'x-access-token': fgtoken}
};

export function fetchEvents() {

	return function(dispatch) {
		dispatch({type: "FETCH_EVENTS"});
		axios.get(config.api_url + "/api/v2/events", axiosConfig)
			.then((response) => {
				dispatch({type: "FETCH_EVENTS_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "FETCH_EVENTS_REJECTED", payload: err})
			})
	}
}

export function updateEvent(_id, field, value) {
	const body = {
		object: {
			_id,
			field,
			value
		}
	};

	return (dispatch) => {
		dispatch({type: "UPDATE_EVENT"});
		axios.post(config.api_url + "/api/v2/event/update", body, axiosConfig)
			.then((response) => {
				dispatch({type: "UPDATE_EVENT_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "UPDATE_EVENT_REJECTED", payload: err})
			})
	}
}

export function createEvent(eventDateUser, eventDate, person_id, eventType, eventPlace, familyContext, localContext, worldContext) {

	const body = {
		object: {
			eventDateUser,
			eventDate,
			person_id,
			eventType,
			eventPlace,
			familyContext,
			localContext,
			worldContext,
		}
	};
	return (dispatch) => {
		dispatch({type: "CREATE_EVENT"});
		axios.post(config.api_url + "/api/v2/event/create", body, axiosConfig)
			.then((response) => {
				dispatch({type: "CREATE_EVENT_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "CREATE_EVENT_REJECTED", payload: err})
			})
	}
}

// modify to accept the feild and value of that field to delete from the collection
export function deleteEvent(field, value) {

	const body = {
		object: {
			field,
			value,
		}
	};

	return (dispatch) => {
		dispatch({type: "DELETE_EVENT"});
		axios.post(config.api_url + "/api/v2/event/delete", body, axiosConfig)
			.then((response) => {
				dispatch({type: "DELETE_EVENT_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_EVENT_REJECTED", payload: err})
			})
	}

}
