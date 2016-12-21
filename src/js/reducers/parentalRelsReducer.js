export default function reducer(state={
		parentalRels: [],
		fetching: false,
		error: null,
	}, action) {

		switch (action.type) {
			case "FETCH_PARENTALRELS": {
				return {...state, fetching: true}
			}
			case "FETCH_PARENTALRELS_REJECTED": {
				return {...state, fetching: false, error: action.payload}
			}
			case "FETCH_PARENTALRELS_FULFILLED": {
				return {
					...state,
					fetching: false,
					parentalRels: action.payload,
				}
			}
		}
		return state
}
