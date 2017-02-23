import cookie from 'react-cookie';

export function getAxiosConfig() {
	return {
		headers: {
			'x-access-token': cookie.load('fg-access-token')
		}
	}
}

export function getAxiosConfigForLogin() {
	return {
		headers: {
			'Content-Type': 'application/json'
			// 'Authorization': undefined
		}
	}
}
