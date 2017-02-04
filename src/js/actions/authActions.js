import axios from 'axios';
import cookie from 'react-cookie';

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
				// save the cookie to store the toke
				cookie.save('fg-access-token', response.data.token);
				dispatch({type: "LOGIN_SUCCESSFUL", payload: response.data})
			})
			.catch((err) => {
				dispatch({type: "LOGIN_ERROR", payload: err})
			})
	}
}

export function logout() {
	return (dispatch) => {
		cookie.remove('fg-access-token');
		dispatch({type: 'LOGOUT_SUCCESSFUL'});
	}
}
