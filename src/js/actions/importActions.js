import axios from 'axios';
import { createEvent } from './eventsActions';
import { createParentalRel } from './parentalRelsActions';

import { updateParentalRel } from './parentalRelsActions';
import { updateStagedPerson } from './stagedPeopleActions';

import { fetchPeople } from './peopleActions';
import { fetchStagedPeople } from './stagedPeopleActions';
import { fetchEvents } from './eventsActions';
import { fetchStagedEvents } from './stagedEventActions';
import { fetchParentalRels } from './parentalRelsActions';
import { fetchPairBondRels } from './pairBondRelsActions';
import { fetchStagedParentalRels } from './stagedParentalRelActions';
import { fetchStagedPairBondRels } from './stagedPairBondRelActions';

import config from '../config.js';
import { getAxiosConfig } from './actionFunctions';

export function autoImport() {
  return (dispatch) => {
    dispatch({type: 'AUTOIMPORT'});
    axios.post(config.api_url + '/api/v2/autoimportall', {}, getAxiosConfig())
      .then((response) => {
        dispatch({type: 'AUTOIMPORT_FULFILLED', payload: response.data})
      })
      .catch((err) => {
        dispatch({type: 'AUTOIMPORT_REJECTED', payload: err})
      })
  }
}

export function importPeopleAndEvents(importRelsAlso) {

  // send an empty body object
  const body = {};

  return (dispatch) => {
    dispatch({type: "IMPORT_PEOPLEANDEVENTS"});
    axios.post(config.api_url + "/api/v2/autoimportpeople", body, getAxiosConfig())
      .then((response) => {
        dispatch({type: "IMPORT_PEOPLEANDEVENTS_FULFILLED", payload: response.data})

        // after running import, refresh the store.
        // TODO: recieve the data through the response.data and append that information to the store.
        dispatch(fetchPeople());
        dispatch(fetchEvents());
        dispatch(fetchStagedPeople());
        dispatch(fetchStagedEvents());
        // if we need to import the Relationships also, call that here. The fetches to refresh the store will be done at the end of importRelationships, so only do that fetch if not also importing the relationships
        if (importRelsAlso) {
          dispatch(importRelationships());
        }
      })
      .catch((err) => {
        dispatch({type: "IMPORT_PEOPLEANDEVENTS_REJECTED", payload: err})
      })
  }
}

export function importRelationships() {
  const body = {};

  return (dispatch) => {
  dispatch({type: "IMPORT_PARENTALRELATIONSHIPS"});
  axios.post(config.api_url + '/api/v2/autoimportparentalrels', body, getAxiosConfig())
    .then((response) => {
      dispatch({type: "IMPORT_PARENTALRELATIONSHIPS_FULFILLED", payload: response.data})
      // after running import, refresh the store with data that was updated.
      // TODO: recieve the data through the response.data and append that information to the store.
      // why refreshing People here? Is the people collection updated when running this import?
      dispatch(fetchPeople());
      dispatch(fetchStagedParentalRels());
      dispatch(fetchParentalRels());
      // we don't need to fetch relationships until they are all available, so the fetches will be done in the next function of importing stagedpairbondrels. Problem with this approach is you don't know which one will complete first - import parents or pairbonds. So putting the relevant fetches inside the .then of the import call
    })
    .catch((err) => {
      dispatch({type: "IMPORT_PARENTALRELATIONSHIPS_REJECTED", payload: err})
    })

  axios.post(config.api_url + '/api/v2/autoimportpairbondrels', body, getAxiosConfig())
    .then((response) => {
      dispatch({type: "IMPORT_PAIRBONDRELATIONSHIPS_FULFILLED", payload: response.data})
        // after running import, refresh the store with data that was updated
        // TODO: recieve the data through the response.data and append that information to the store.
        // why refreshing People here? Is the people collection updated when running this import?
        dispatch(fetchPeople());
        dispatch(fetchPairBondRels())
        dispatch(fetchStagedPairBondRels());
    })
    .catch((err) => {
      dispatch({type: "IMPORT_PAIRBONDRELATIONSHIPS_REJECTED", payload: err})
    })
  }
}

export function clearStagedRecords() {
  return (dispatch) => {
    dispatch({type: "CLEAR_STAGEDRECORDS"});
    axios.post(config.api_url + '/api/v2/clearstagedrecords', {}, getAxiosConfig())
      .then((response) => {
        dispatch({type: "CLEAR_STAGEDRECORDS_FULFILLED", payload: response.data})
        // TODO: do we need to fetch here, or should we just clear the store?
        dispatch(fetchStagedParentalRels());
        dispatch(fetchStagedPairBondRels());
        dispatch(fetchStagedEvents());
        dispatch(fetchStagedPeople());
      })
      .catch((err) => {
        dispatch({type: "CLEAR_STAGEDRECORDS_REJECTED", payload: err})
      })
  }
}

export function clearSavedRecords() {
  return (dispatch) => {
    dispatch({type: 'CLEAR_ALLRECORDS'});
    axios.post(config.api_url + '/api/v2/clearsavedrecords', {}, getAxiosConfig())
      .then((response) => {
        dispatch({type: 'CLEAR_ALLRECORDS_FULFILLED', payload: response.data})
        dispatch(fetchPeople());
        dispatch(fetchEvents());
        dispatch(fetchParentalRels());
        dispatch(fetchPairBondRels())
        dispatch(fetchStagedParentalRels());
        dispatch(fetchStagedPairBondRels());
        dispatch(fetchStagedEvents());
        dispatch(fetchStagedPeople());
      })
      .catch((err) => {
        dispatch({type: 'CLEAR_ALLRECORDS_REJECTED', payload: err})
      })
  }
}

export function importParentalRel(child_id, parent_id, relationshipType, subType, startDate, endDate, _id) {

  const body = {
    object: {
      child_id,
      parent_id,
      relationshipType,
      subType,
      startDate,
      endDate,
    }
  };

  return (dispatch) => {
    // need to call create_parentalrel dispatch to have access to the newly created information
    dispatch({type: "CREATE_PARENTALREL"});
    axios.post(config.api_url + '/api/v2/parentalrel/create', body, getAxiosConfig())
      .then((response) => {
        dispatch({type: "CREATE_PARENTALREL_FULFILLED", payload: response.data})

        const updateRel1 = {
          object : {
            _id: _id,
            field: 'genie_id',
            value: response.data._id
          }
        };
        const updateRel2 = {
          object : {
            _id: _id,
            field: 'ignore',
            value: 'true',
          }
        };

        updateParentalRel(updateRel1)
        updateParentalRel(updateRel2)
      })
      .catch((err) => {
        dispatch({type: "CREATE_PARENTALREL_REJECTED", payload: err})
      })
  }
}

export function importPerson(fName, mName, lName, sexAtBirth, birthDate, birthPlace, deathDate, deathPlace, notes, _id) {

	// construct body for api call to create person
	const body = {
		object: {
			fName,
			mName,
			lName,
			sexAtBirth,
		}
	};
	return (dispatch) => {
    // need to call this dispatch here to have access to the newly created information
		dispatch({type: "CREATE_PERSON"});
		axios.post(config.api_url + "/api/v2/person/create", body, getAxiosConfig())
			.then((response) => {
				dispatch({type: "CREATE_PERSON_FULFILLED", payload: response.data})
				// create body post for event create for birthDate
				const bodyBirth = {
					object: {
						person_id: response.data._id,
						eventType: 'Birth',
						eventDate: birthDate,
						eventPlace: birthPlace,
					}
				}
        createEvent(bodyBirth)

				// do post for event create for deathDate, but only if there is a death
				if (deathDate) {
					const bodyDeath = {
						object: {
							person_id: response.data._id,
							eventType: 'Death',
							eventDate: deathDate,
							eventPlace: deathPlace,
						}
					}
        }

        createEvent(bodyDeath)

        const bodyUpdate1 = {
          object : {
            _id: _id,
            field: 'genie_id',
            value: response.data._id
          }
        }
        const bodyUpdate2 = {
          object : {
            _id: _id,
            field: 'ignore',
            value: 'true'
          }
        }
        
        updateStagedPerson(bodyUpdate1)
        updateStagedPerson(bodyUpdate2)
			})
			.catch((err) => {
				dispatch({type: "CREATE_PERSON_REJECTED", payload: err})
			})
	}
}

export function importPairBondRel(personOne_id, personTwo_id, relationshipType, subType, startDate, endDate, _id) {

  const body = {
    object: {
      personOne_id,
      personTwo_id,
      relationshipType,
      subType,
      startDate,
      endDate,
    }
  };

  return (dispatch) => {
    // need to call this dispatch here to have access to the newly created information
    dispatch({type: "CREATE_PAIRBONDREL"});
    axios.post(config.api_url + '/api/v2/pairbondrel/create', body, getAxiosConfig())
      .then((response) => {
        dispatch({type: "CREATE_PAIRBONDREL_FULFILLED", payload: response.data})

        const updateRel1 = {
          object : {
            _id: _id,
            field: 'genie_id',
            value: response.data._id
          }
        };
        const updateRel2 = {
          object : {
            _id: _id,
            field: 'ignore',
            value: 'true',
          }
        };

        updateStagedPerson(updateRel1)
        updateStagedPerson(updateRel2)
      })
      .catch((err) => {
        dispatch({type: "CREATE_PAIRBONDREL_REJECTED", payload: err})
      })
  }
}
