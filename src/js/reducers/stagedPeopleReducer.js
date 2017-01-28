export default function reducer(state={
  stagedPeople : [],
  fetching : false,
  error : null,
}, action) {

  switch(action.type) {
    case "FETCH_STAGINGPEOPLE": {
      return {...state, fetching: true}
    }
    case "FETCH_STAGINGPEOPLE_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
    case "FETCH_STAGINGPEOPLE_FULFILLED": {
      return {...state, fetching: false, stagedPeople: action.payload}
    }
    case "UPDATE_STAGINGPERSON": {
      return {...state, fetching: true}
    }
    case "UPDATE_STAGINGPERSON_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
		case "UPDATE_STAGINGPERSON_FULFILLED": {
			// todo: throw error on invalid field???
			const newPerson = action.payload;
			const oldPersonIndex = state.stagedPeople.findIndex(
				person => person._id === newPerson._id
			);
			const newPeople = [
				...state.stagedPeople.slice(0, oldPersonIndex),
				newPerson,
				...state.stagedPeople.slice(oldPersonIndex+1)
			];

			return {
				...state,
				fetching: false,
				stagedPeople: newPeople,
			};
		}
  }
  return state

}
