export default function reducer(state={
  stagedParentalRels : [],
  fetched : false,
  fetching : false,
  error : null,
}, action) {

  switch(action.type) {
    case "FETCH_STAGINGPARENTALRELS": {
      return {...state, fetching: true}
    }
    case "FETCH_STAGINGPARENTALRELS_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
    case "FETCH_STAGINGPARENTALRELS_FULFILLED": {
      console.log('fulfilled fetching', action.payload)
      return {...state, fetching: false, stagedParentalRels: action.payload}
    }
  }
  return state

}
