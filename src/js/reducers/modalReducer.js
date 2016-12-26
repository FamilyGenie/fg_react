export default function reducer(state={
		// this is to store the parentalRel that is to appear in the modal window for the parentalrel-lineitemedit
		parentalRel: "",
		pairBondRel: "",
	}, action) {

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
		}
		return state
}
