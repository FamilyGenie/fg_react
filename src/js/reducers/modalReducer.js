export default function reducer(state={
		// this is to store the parentalRel that is to appear in the modal window for the parentalrel-lineitemedit
		parentalRel: "",
		pairBondRel: "",
		event: "",
	newPerson: "",
	},
	action = ""
) {
	switch (action.type) {
		case "SET_PARENTALREL": {
			return {
				...state,
				parentalRel: action.payload}
		}
		case "SET_PAIRBONDREL": {
			return {
				...state,
				pairBondRel: action.payload}
		}
		case "SET_MODAL_EVENT": {
			return {
				...state,
				event: action.payload}
		}
		// this is called when the eventlineitemedit modal is closed, so that the event that was being edited is not accidentally opened when the modal is opened next
		// I think this will be able to be deleted when the new person modal is complete. JJF 2/24/2017
		case "RESET_MODAL_EVENT": {
			return {
				...state,
				event: ""}
		}
		case "OPEN_NEWPERSON_MODAL" : {
			return {
			  ...state,
			  newPerson: {
				...state.newPerson,
				modalIsOpen: true,
			  }
			}
		}
		case "SET_NEWPERSON_MODAL": {
			return {
				...state,
				newPerson: {
					...state.newPerson,
					child: action.payload,
				}
			}
		}
		case "CLOSE_NEWPERSON_MODAL": {
			return {
			  ...state,
			  newPerson: {
				...state.newPerson,
				modalIsOpen: false,
			  }
			}
		}
	}
	return state
}
