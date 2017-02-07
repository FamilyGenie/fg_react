import { combineReducers } from 'redux'

import events from "./eventsReducer"
import eventTypes from "./eventTypesReducer"
import modal from "./modalReducer"
import pairBondRels from "./pairBondRelsReducer"
import pairBondRelTypes from "./pairBondRelTypesReducer"
import parentalRels from "./parentalRelsReducer"
import parentalRelTypes from "./parentalRelTypesReducer"
import parentalRelSubTypes from "./parentalRelSubTypesReducer"
import people from "./peopleReducer"
import user from "./userReducer"
import stagedPeople from "./stagedPeopleReducer"
import importPeople from "./importPeopleReducer"
import stagedParentalRels from "./stagedParentalRelsReducer"
import stagedEvents from "./stagedEventsReducer"
import historyBarReducer from "./historyBarReducer"

export default combineReducers({
  events,
  eventTypes,
  modal,
  pairBondRels,
  pairBondRelTypes,
  parentalRels,
  parentalRelTypes,
  parentalRelSubTypes,
  people,
  user,
  stagedPeople,
  importPeople,
  stagedParentalRels,
  stagedEvents,
  historyBarReducer,
})
