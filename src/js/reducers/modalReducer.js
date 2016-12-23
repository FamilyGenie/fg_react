export default function reducer(state={
		modalIsOpen: false,
		modalParentalRelIsOpen: false,
		// this is to store the parentalRel that is to appear in the modal window
		parentalRel: "",
	}, action) {

		switch (action.type) {
			case "OPEN_MODAL": {
				return {modalIsOpen: true}
			}
			case "CLOSE_MODAL": {
				return {
					...state,
					modalIsOpen: false}
			}
			case "OPEN_PARENTALRELMODAL": {
				return {
					...state,
					modalParentalRelIsOpen: true,
					parentalRel: action.payload}
			}
			case "CLOSE_PARENTALRELMODAL": {
				return {modalParentalRelIsOpen: false}
			}
		}
		return state
}
