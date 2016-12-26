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
			case "UPDATE_PARENTALREL": {
				return {...state, fetching: true}
			}
			case "UPDATE_PARENTALREL_FULFILLED": {
				// todo: throw error on invalid field???
				const newParentalRel = action.payload;
				const oldParentalRelIndex = state.parentalRels.findIndex(rel => rel._id === newParentalRel._id);
				const newParentalRels = [...state.parentalRels.slice(0, oldParentalRelIndex), newParentalRel, ...state.parentalRels.slice(oldParentalRelIndex+1)];

				return {
					...state,
					fetching: false,
					parentalRels: newParentalRels,
				}
			}
			case "UPDATE_PARENTALREL_REJECTED": {
				return {...state, fetching: false, error: action.payload}
			}
		}
		return state
}