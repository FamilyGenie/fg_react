export default function reducer(state={
		modalIsOpen: false,
		modalParentalRelIsOpen: false
	}, action) {

		switch (action.type) {
			case "OPEN_MODAL": {
				return {modalIsOpen: true}
			}
			case "CLOSE_MODAL": {
				return {modalIsOpen: false}
			}
			case "OPEN_PARENTALRELMODAL": {
				return {modalParentalRelIsOpen: true}
			}
			case "CLOSE_PARENTALRELMODAL": {
				return {modalParentalRelIsOpen: false}
			}
		}
		return state
}
