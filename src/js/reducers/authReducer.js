export default function reducer(
	state={
		userName: '',
		fetching: false,
		error: null,
	},
	action = ""
) {

	switch (action.type) {
		case "LOGIN_ATTEMPT": {
			return {
				...state,
				fetching: true
			};
		}
		case "LOGIN_SUCCESSFUL": {
			// on successful login, set userName in the store, so that it can be retrieved and also used to test if the user is logged in or not
			return {
				...state,
				fetching: false,
				userName: action.payload.userName,
			};
		}
		case "LOGIN_ERROR": {
			return {
				...state,
				fetching: false,
				error: action.payload
			};
		}
		case "LOGOUT_SUCCESSFUL": {
			// on successful logout, set userName to falsy value
			return {
				...state,
				people: [],
				events: [],
				pairBondRels: [],
				parentalRels: [],
				userName: ''
			};
		}
	}

	return state
}
