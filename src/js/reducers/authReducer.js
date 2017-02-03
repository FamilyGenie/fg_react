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
	}

	return state
}
