import axios from "axios";
import cookie from "react-cookie";

import config from "../config.js";

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
	headers: {'x-access-token': fgtoken}
};

export function fetchPairBondRels() {

	return function(dispatch) {
		dispatch({type: "FETCH_PAIRBONDRELS"});
		axios.get(config.api_url + "/api/v2/pairbondrels", axiosConfig)
			.then((response) => {
				dispatch({type: "FETCH_PAIRBONDRELS_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "FETCH_PAIRBONDRELS_REJECTED", payload: err})
			})
	}
}

export function updatePairBondRel(_id, field, value) {
	const body = {
		object: {
			_id,
			field,
			value
		}
	};

	return (dispatch) => {
		dispatch({type: "UPDATE_PAIRBONDREL"});
		axios.post(config.api_url + "/api/v2/pairbondrel/update", body, axiosConfig)
			.then((response) => {
				dispatch({type: "UPDATE_PAIRBONDREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "UPDATE_PAIRBONDREL_REJECTED", payload: err})
			})
	}
}

export function createPairBondRel(personOne_id, personTwo_id, relationshipType, startDate, startDateUser, endDate, endDateUser) {

	const body = {
		object: {
			personOne_id,
			personTwo_id,
			relationshipType,
			startDateUser,
			startDate,
			endDateUser,
			endDate,
		}
	};
	return (dispatch) => {
		dispatch({type: "CREATE_PAIRBONDREL"});
		axios.post(config.api_url + "/api/v2/pairbondrel/create", body, axiosConfig)
			.then((response) => {
				dispatch({type: "CREATE_PAIRBONDREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "CREATE_PAIRBONDREL_REJECTED", payload: err})
			})
	}
}

// modified to be able to accept and then send to the API, the field and the value to delete from the pairBondRels table. This way, we can tell the API to delete all records for a given personOne_id (for example).
export function deletePairBondRel(field, value) {

	const body = {
		object: {
			[field]: value,
		}
	};

	return (dispatch) => {
		dispatch({type: "DELETE_PAIRBONDREL"});
		axios.post(config.api_url + "/api/v2/pairbondrel/delete", body, axiosConfig)
			.then((response) => {
				dispatch({type: "DELETE_PAIRBONDREL_FULFILLED", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "DELETE_PAIRBONDREL_REJECTED", payload: err})
			})
	}

}
