import { combineReducers } from "redux"

import events from "./eventsReducer"
import modal from "./modalReducer"
import pairBondRels from "./pairBondRelsReducer"
import parentalRels from "./parentalRelsReducer"
import parentalRelTypes from "./parentalRelTypesReducer"
import parentalRelSubTypes from "./parentalRelSubTypesReducer"
import people from "./peopleReducer"
import user from "./userReducer"


export default combineReducers({
  events,
  modal,
  pairBondRels,
  parentalRels,
  parentalRelTypes,
  parentalRelSubTypes,
  people,
  user,
})
