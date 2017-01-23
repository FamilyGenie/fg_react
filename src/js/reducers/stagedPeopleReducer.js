export default function reducer(state={
  stagedPeople : [],
  fetched : false,
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
      return {...state, fetching: false}
    }
  }
  return state

}
