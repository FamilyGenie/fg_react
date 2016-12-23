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
		}
		return state
}
