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
			case "SET_EVENT": {
				return {
					...state,
					event: action.payload}
			}
			// this is called when the eventlineitemedit modal is closed, so that the event that was being edited is not accidentally opened when the modal is opened next
			case "RESET_EVENT": {
				return {
					...state,
					event: ""}
			}
      case "SET_NEWPERSON" : {
        return {
          ...state,
          newPerson: action.payload
        }
      }
      case "CLOSE_NEWPERSON_MODAL": {
        return {
          ...state
        }
      }
      case "CLOSE_NEWPERSON_MODAL_FULFILLED" : {
        return {
          ...state,
          ...state.modal,
          newPerson: {
            ...state.newPerson,
            modalIsOpen: false,
          }
        }
      }
    }
		return state
}
