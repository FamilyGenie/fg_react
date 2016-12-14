export default function reducer(state={
		people: [],
		fetching: false,
		error: null,
	}, action) {

		switch (action.type) {
			case "FETCH_PEOPLE": {
				return {...state, fetching: true}
			}
			case "FETCH_PEOPLE_REJECTED": {
				return {...state, fetching: false, error: action.payload}
			}
			case "FETCH_PEOPLE_FULFILLED": {
				return {
					...state,
					fetching: false,
					people: action.payload,
				}
			}
			case "ADD_PERSON": {
				return {
					...state,
					people: [...state.people, action.payload],
				}
			}
			case "UPDATE_PERSON_FULFILLED": {
				// todo: throw error on invalid field???
				const newPerson = action.payload;
				const oldPersonIndex = state.people.findIndex(person => person._id === newPerson._id);
				const newPeople = [...state.people.slice(0, oldPersonIndex), newPerson, ...state.people.slice(oldPersonIndex+1)];

				return {
					...state,
					fetching: false,
					people: newPeople,
				}
			}
			case "UPDATE_PERSON_REJECTED": {
				return {...state, fetching: false, error: action.payload}
			}
			case "DELETE_PERSON": {
				return {
					...state,
					people: state.people.filter(person => person._id !== action.payload),
				}
			}
		}

		return state
}