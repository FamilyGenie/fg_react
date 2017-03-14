//
export function updateHelpMessage(value) {

	return (dispatch) => {
		dispatch({type: "UPDATE_HELPMESSAGE", payload: value});
	}
}
