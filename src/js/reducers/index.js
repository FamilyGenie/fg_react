import { combineReducers } from "redux"

import events from "./eventsReducer"
import people from "./peopleReducer"
import user from "./userReducer"

export default combineReducers({
  events,
  people,
  user,
})
