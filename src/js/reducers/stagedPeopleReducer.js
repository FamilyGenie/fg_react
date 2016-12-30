export default function reducer(state={
  stagedEvents : [],
  fetched : false,
  fetching : false,
  error : null,
}, action) {

  switch(action.type) {
    case "FETCH_STAGING_PEOPLE": {
      return {...state, fetching: true}
    }
    case "FETCH_STAGING_PEOPLE_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
    case "FETCH_STAGING_PEOPLE_FULFILLED": {
      return {...state, fetching: false, events: action.payload}
    }
  }
  return state

}
