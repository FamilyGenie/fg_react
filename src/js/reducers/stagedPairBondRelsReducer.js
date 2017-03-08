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
      return {...state,fetching: false, stagedPairBondRels: action.payload}
    }
    case "UPDATE_STAGINGPAIRBONDREL": {
      return {...state, fetching: true}
    }
    case "UPDATE_STAGINGPAIRBONDREL_REJECTED": {
      return {...state, fetching: false, error: action.payload}
    }
    case "UPDATE_STAGINGPAIRBONDREL_FULFILLED": {
      const newStagedPairBondRel = action.payload;
      const oldStagedPairBondRelIndex = state.stagedPairBondRels.findIndex(
        stagedPairBondRel => stagedPairBondRel._id === newStagedPairBondRel._id
      );
      const newStagedPairBondRels = [
        ...state.stagedPairBondRels.slice(0, oldStagedPairBondRelIndex),
        newStagedPairBondRel,
        ...state.stagedPairBondRels.slice(oldStagedPairBondRelIndex+1)
      ];

      return {
        ...state, 
        fetching: false, 
        stagedPairBondRels: newStagedPairBondRels}
    }
  }
  return state
}
