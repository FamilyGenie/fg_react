import { combineReducers } from "redux"

import events from "./eventsReducer"
import modal from "./modalReducer"
import pairBondRels from "./pairBondRelsReducer"
import parentalRels from "./parentalRelsReducer"
import people from "./peopleReducer"
import user from "./userReducer"
import stagedPeople from "./stagedPeopleReducer"


export default combineReducers({
  events,
  modal,
  pairBondRels,
  parentalRels,
  people,
  user,
  stagedPeople,
})
