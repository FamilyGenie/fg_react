export default function reducer(state={
  stagedPairBondRels : [],
  fetched : false,
  fetching : false,
  error : null,
}, action) {

  switch(action.type) {
    case "FETCH_STAGINGPAIRBONDRELS": {
      return {...state, fetching: true}
    }
    case "FETCH_STAGINGPAIRBONDRELS_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
    case "FETCH_STAGINGPAIRBONDRELS_FULFILLED": {
      return {...state,fetching: false, stagedPairbondRels: action.payload}
    }
  }
  return state
}
