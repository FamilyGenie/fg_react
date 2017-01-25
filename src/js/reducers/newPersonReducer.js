export default function reducer(
  state={
    person: {},
    fetching: false,
    error: null,
  },
  action = ""
) {
  switch (action.type) {
    case "CREATE_NEWPERSON": {
      return {
        ...state,
        fetching: true
      };
    }
    case "CREATE_NEWPERSON_REJECTED": {
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    }
  }
  return state;
}
