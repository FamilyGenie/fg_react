export default function reducer(state={
		pairBondRels: [],
		fetching: false,
		error: null,
	}, action) {

		switch (action.type) {
			case "FETCH_PAIRBONDRELS": {
				return {...state, fetching: true}
			}
			case "FETCH_PAIRBONDRELS_REJECTED": {
				return {...state, fetching: false, error: action.payload}
			}
			case "FETCH_PAIRBONDRELS_FULFILLED": {
				return {
					...state,
					fetching: false,
					pairBondRels: action.payload,
				}
			}
			case "UPDATE_PAIRBONDREL": {
				return {...state, fetching: true}
			}
			case "UPDATE_PAIRBONDREL_FULFILLED": {
				// todo: throw error on invalid field???
				const newPairBondRel = action.payload;
				const oldPairBondRelIndex = state.pairBondRels.findIndex(pairBondRel => pairBondRel._id === newPairBondRel._id);
				const newPairBondRels = [...state.pairBondRels.slice(0, oldPairBondRelIndex), newPairBondRel, ...state.pairBondRels.slice(oldPairBondRelIndex+1)];

				return {
					...state,
					fetching: false,
					pairBondRels: newPairBondRels,
				}
			}
			case "UPDATE_PAIRBONDREL_REJECTED": {
				return {...state, fetching: false, error: action.payload}
			}
			case "CREATE_PAIRBONDREL": {
				return {...state, fetching: true}
			}
			case "CREATE_PAIRBONDREL_FULFILLED": {
				const newObject = action.payload;
				const newArray = state.people;
				newObject.push(newArray);
				return {
					...state,
					fetching: false,
					pairBondRels: newArray,
				}
			}
			case "CREATE_PAIRBONDREL_REJECTED": {
				return {...state, fetching: false, error: action.payload}
			}
			case "DELETE_PAIRBONDREL": {
				return {...state, fetching: true}
			}
			case "DELETE_PAIRBONDREL_FULFILLED": {
				// todo: throw error on invalid field???
				// the delete person api returns all people, so just set the newPeople array to the payload that is returned
				const newArray = action.payload;
				return {
					...state,
					fetching: false,
					pairBondRels: newArray,
				}
			}
			case "DELETE_PAIRBONDREL_REJECTED": {
				return {...state, fetching: false, error: action.payload}
			}
		}
		return state
}
