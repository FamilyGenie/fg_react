export function openModal() {
	return function(dispatch) {
		dispatch({type: "OPEN_MODAL"});
	}
}

export function closeModal() {
	return function(dispatch) {
		dispatch({type: "CLOSE_MODAL"});
	}
}

export function openParentalRelModal(parentalRel) {
	console.log("in modalActions with: ", parentalRel);
	// set the type to tell the parentalrelmodal to open, and pass the object to be edited in the modal window as the payload
	return function(dispatch) {
		dispatch({type: "OPEN_PARENTALRELMODAL", payload: parentalRel});
	}
}

export function closeParentalRelModal() {
	return function(dispatch) {
		dispatch({type: "CLOSE_PARENTALRELMODAL"});
	}
}
