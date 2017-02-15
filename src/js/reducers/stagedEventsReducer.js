export default function reducer(state={
  stagedEvents: [],
  fetching: false,
  err: null,
}, action) {
  switch(action.type) {
    case "FETCH_STAGINGEVENTS": {
      return {...state, fetching: true}
    }
    case "FETCH_STAGINGEVENTS_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
    case "FETCH_STAGINGEVENTS_FULFILLED": {
      return {...state, fetching: false, stagedEvents: action.payload}
    }
    case "CLEAR_STAGEDEVENTS": {
      return {
        ...state,
        fetching: false,
        stagedEvents: [],
      };
    }
  }
  return state
}
