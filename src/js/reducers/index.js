import { combineReducers } from 'redux'

import auth from './authReducer'
import events from './eventsReducer'
import eventTypes from './eventTypesReducer'
import helpMessage from './helpMessageReducer'
import historyBarReducer from './historyBarReducer'
import importRecords from './importRecords'
import modal from './modalReducer'
import pairBondRels from './pairBondRelsReducer'
import pairBondRelTypes from './pairBondRelTypesReducer'
import parentalRels from './parentalRelsReducer'
import parentalRelTypes from './parentalRelTypesReducer'
import parentalRelSubTypes from './parentalRelSubTypesReducer'
import people from './peopleReducer'
import stagedPeople from './stagedPeopleReducer'
import stagedParentalRels from './stagedParentalRelsReducer'
import stagedPairBondRels from './stagedPairBondRelsReducer'
import stagedEvents from './stagedEventsReducer'
// import user from './userReducer'

export default combineReducers({
  auth,
  events,
  eventTypes,
  helpMessage,
  historyBarReducer,
  importRecords,
  modal,
  pairBondRels,
  pairBondRelTypes,
  parentalRels,
  parentalRelTypes,
  parentalRelSubTypes,
  people,
  stagedPeople,
  stagedParentalRels,
  stagedPairBondRels,
  stagedEvents,
  // user,
})
