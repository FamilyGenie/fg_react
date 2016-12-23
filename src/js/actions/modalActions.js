
export function setParentalRel(parentalRel) {
	// set the type to tell the parentalrelmodal to open, and pass the object to be edited in the modal window as the payload
	return function(dispatch) {
		dispatch({type: "SET_PARENTALREL", payload: parentalRel});
	}
}
