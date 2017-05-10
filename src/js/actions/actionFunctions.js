import cookie from 'react-cookie';

export function getAxiosConfig() {
	return {
		headers: {
			'x-access-token': cookie.load('fg-access-token'),
			'user-name': cookie.load('user-name')
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
