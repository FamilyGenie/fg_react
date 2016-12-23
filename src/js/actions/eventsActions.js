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
