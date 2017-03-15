// this is just storing static values, so no need for actions
export default function reducer(
	state = {
		helpMessage: 'Test Message',
	}, action
) {
	switch(action.type) {
		case "UPDATE_HELPMESSAGE": {
			return {
				...state,
				helpMessage: action.payload
			}
		}
	}
	return state;
}
