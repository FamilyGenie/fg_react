import axios from 'axios';
import cookie from 'react-cookie';

import config from '../config.js';

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
	headers: {'x-access-token': fgtoken}
};

export function login(username, password) {
	console.log("in authActions.login with params: ", username, password);
	const body = {
		username,
		password
	};

	return (dispatch) => {
		dispatch({type: "LOGIN"});
		console.log('in authActions.login with body and axiosConfig: ', body, axiosConfig);
		axios.post(config.api_url + "/api/v1/login", body, axiosConfig)
			.then((response) => {
				console.log('in authAction LOGIN_SUCCESSFUL ', response.data);
				dispatch({type: "LOGIN_SUCCESSFUL", payload: response.data})
			})
			.catch((err) => {
				console.log('in authAction LOGIN_SUCCESSFUL ', err);
				dispatch({type: "LOGIN_ERROR", payload: err})
			})
	}
}
