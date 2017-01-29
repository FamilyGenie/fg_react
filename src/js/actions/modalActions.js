
export function setParentalRel(parentalRel) {
	// set the type to tell the parentalrelmodal to open, and pass the object to be edited in the modal window as the payload
	return function(dispatch) {
		dispatch({type: "SET_PARENTALREL", payload: parentalRel});
	}
}

export function setPairBondRel(pairBondRel) {
	// set the type to tell the pairBondrelmodal to open, and pass the object to be edited in the modal window as the payload
	return function(dispatch) {
		dispatch({type: "SET_PAIRBONDREL", payload: pairBondRel});
	}
}

export function setEvent(event) {
	// set the type to tell the eventModal to open, and pass the object to be edited in the modal window as the payload
	return function(dispatch) {
		dispatch({type: "SET_EVENT", payload: event});
	}
}

export function resetEvent(event) {
	// set the event to empty string. This action should be called when the modal is closing.
	return function(dispatch) {
		dispatch({type: "RESET_EVENT"});
	}
}

export function setNewPerson(newPerson) {
	// set the type to tell the newPersonModal to open, and pass the object to be edited in the modal window as the payload
	return function(dispatch) {
		dispatch({type: "SET_NEWPERSON", payload: newPerson});
	}
}

export function closeNewPersonModal() {
  // the reducer will change the modalIsOpen variable to false, in order to close the modal.
  return function(dispatch) {
    dispatch({type: "CLOSE_NEWPERSON_MODAL_FULFILLED"})
  }
}
