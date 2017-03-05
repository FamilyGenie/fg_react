export default function reducer(state={
  stagedParentalRels : [],
  fetched : false,
  fetching : false,
  error : null,
}, action) {

  switch(action.type) {
    case "FETCH_STAGINGPARENTALRELS": {
      return {
        ...state,
        fetching: true
      }
    }
    case "FETCH_STAGINGPARENTALRELS_REJECTED": {
      return {
        ...state, 
        fetching: false, 
        error: action.payload
      }
    }
    case "FETCH_STAGINGPARENTALRELS_FULFILLED": {
      return {
        ...state, 
        fetching: false, 
        stagedParentalRels: action.payload
      }
    }
    case "UPDATE_STAGEDPARENTALREL": {
      return {
        ...state, 
        fetching: true
      }
    }
    case "UPDATE_STAGEDPARENTALREL_REJECTED": {
      return {
        ...state, 
        fetching: false, 
        error: action.payload
      }
    }
    case "UPDATE_STAGEDPARENTALREL_FULFILLED": {
      const newStagedParentalRel = action.payload;
      const oldStagedParentalRelIndex = state.stagedParentalRels.findIndex(
        stagedParentalRel => stagedParentalRel._id === newStagedParentalRel._id
      );
      const newStagedParentalRels = [
        ...state.stagedParentalRels.slice(0, oldStagedParentalRelIndex),
        newStagedParentalRel,
        ...state.stagedParentalRels.slice(oldStagedParentalRelIndex + 1)
      ];

      return {
        ...state,
        fetching: false,
        stagedParentalRels: newStagedParentalRels,
      }
    }
  }
  return state
}
