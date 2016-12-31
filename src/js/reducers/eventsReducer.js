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
			case "UPDATE_EVENT": {
			return {
				...state,
				fetching: true
				};
			}
			case "UPDATE_EVENT_FULFILLED": {
				// todo: throw error on invalid field???
				const newObject = action.payload;
				const oldObjectIndex = state.events.findIndex(
					rel => rel._id === newObject._id
				);
				const newArray = [
					...state.events.slice(0, oldObjectIndex),
					newObject,
					...state.events.slice(oldObjectIndex+1)
				];

				return {
					...state,
					fetching: false,
					events: newArray,
				};
			}
			case "UPDATE_EVENT_REJECTED": {
				return {
					...state,
					fetching: false,
					error: action.payload
				};
			}
		}
		return state
}
