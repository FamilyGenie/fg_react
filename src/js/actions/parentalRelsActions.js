import axios from "axios";

import config from "../config.js";
import { getAxiosConfig } from './actionFunctions';


export function fetchParentalRels() {

	return function(dispatch) {
		dispatch({type: "FETCH_PARENTALRELS"});
		axios.get(config.api_url + "/api/v2/parentalrels", getAxiosConfig())
			.then((response) => {
				dispatch({type: "FETCH_PARENTALRELS_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "FETCH_PARENTALRELS_REJECTED", payload: err})
			})
	}
}

export function updateParentalRel(_id, field, value) {
	const body = {
		object: {
			_id,
			field,
			value
		}
	};

	return (dispatch) => {
		dispatch({type: "UPDATE_PARENTALREL"});
		axios.post(config.api_url + "/api/v2/parentalrel/update", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "UPDATE_PARENTALREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "UPDATE_PARENTALREL_REJECTED", payload: err})
			})
	}
}

export function createParentalRel(child_id, parent_id, relationshipType, subType, startDateUser, startDate, endDateUser, endDate) {

	const body = {
		object: {
			child_id,
			parent_id,
			relationshipType,
			subType,
			startDateUser,
			startDate,
			endDateUser,
			endDate,
		}
	};
	return (dispatch) => {
		dispatch({type: "CREATE_PARENTALREL"});
		axios.post(config.api_url + "/api/v2/parentalrel/create", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "CREATE_PARENTALREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "CREATE_PARENTALREL_REJECTED", payload: err})
			})
	}
}

// modify to it accepts the feild and value of that field to delete from the collection
export function deleteParentalRel(field, value) {

	const body = {
		object: {
			field,
			value,
		}
	};

	return (dispatch) => {
		dispatch({type: "DELETE_PARENTALREL"});
		axios.post(config.api_url + "/api/v2/parentalrel/delete", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "DELETE_PARENTALREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_PARENTALREL_REJECTED", payload: err})
			})
	}

}
