import { combineReducers } from 'redux'

import auth from './authReducer'
import events from './eventsReducer'
import eventTypes from './eventTypesReducer'
import modal from './modalReducer'
import pairBondRels from './pairBondRelsReducer'
import pairBondRelTypes from './pairBondRelTypesReducer'
import parentalRels from './parentalRelsReducer'
import parentalRelTypes from './parentalRelTypesReducer'
import parentalRelSubTypes from './parentalRelSubTypesReducer'
import people from './peopleReducer'
import user from './userReducer'
import stagedPeople from './stagedPeopleReducer'
import importRecords from './importRecords'
import stagedParentalRels from './stagedParentalRelsReducer'
import stagedPairBondRels from './stagedPairBondRelsReducer'
import stagedEvents from './stagedEventsReducer'
import historyBarReducer from './historyBarReducer'

export default combineReducers({
  auth,
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
  importRecords,
  stagedParentalRels,
  stagedPairBondRels,
  stagedEvents,
  historyBarReducer,
})
