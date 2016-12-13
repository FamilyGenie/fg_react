import { combineReducers } from "redux"

import people from "./peopleReducer"
import user from "./userReducer"

export default combineReducers({
  people,
  user,
})