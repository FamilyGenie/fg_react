import axios from "axios";

import config from "../config.js";
import { getAxiosConfig } from './actionFunctions';

export function logEvent(action) {
	const body = {
		object: {
			action
		}
	};

	return (dispatch) => {
		// we are not dispatching anything, because this will have no impact on the store
		axios.post(config.api_url + "/api/v2/logevent", body, getAxiosConfig())
			.then((response) => {
				// no need to do anything
			})
			.catch((err) => {
			})
	}
}
