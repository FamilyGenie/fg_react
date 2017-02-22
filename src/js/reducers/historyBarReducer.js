export default function reducer(state={
  historyBarOpen: true,
}, action = ""
) {
  switch(action.type) {
    case "OPEN_HISTORYBAR": {
      return {
        ...state,
        historyBarOpen: action.payload
      }
    }
    case "CLOSE_HISTORYBAR": {
      return {
        ...state,
        historyBarOpen: action.payload
      }
    }
  }
  return state;
}
