// this changes whether or not the history bar is closed in the store, and toggles that on the front end
export function closeHistoryBar() {
  return function(dispatch) {
    dispatch({type: "CLOSE_HISTORYBAR", payload: false});
  }
}
export function openHistoryBar() {
  return function(dispatch) {
    dispatch({type: "OPEN_HISTORYBAR", payload: true});
  }
}
