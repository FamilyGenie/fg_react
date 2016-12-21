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

export function openParentalRelModal() {
	return function(dispatch) {
		dispatch({type: "OPEN_PARENTALRELMODAL"});
	}
}

export function closeParentalRelModal() {
	return function(dispatch) {
		dispatch({type: "CLOSE_PARENTALRELMODAL"});
	}
}
