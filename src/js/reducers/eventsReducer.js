export default function reducer(state={
		events: [],
		fetched: false,
		fetching: false,
		error: null,
	}, action) {

		switch (action.type) {
			case "FETCH_EVENTS": {
				return {...state, fetching: true}
			}
			case "FETCH_EVENTS_REJECTED": {
				return {...state, fetching: false, error: action.payload}
			}
			case "FETCH_EVENTS_FULFILLED": {
				return {
					...state,
					fetching: false,
					events: action.payload,
				}
			}
		}
		return state
}
