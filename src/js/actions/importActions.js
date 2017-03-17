import axios from 'axios';
import { createEvent } from './eventsActions';
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

export function importPeopleAndEvents() {

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
      // we don't need to fetch relationships until they are all available, so the fetches will be done in the next function of importing stagedpairbondrels
    })
    .catch((err) => {
      dispatch({type: "IMPORT_PARENTALRELATIONSHIPS_REJECTED", payload: err})
    })

  axios.post(config.api_url + '/api/v2/autoimportpairbondrels', body, getAxiosConfig())
    .then((response) => {
      dispatch({type: "IMPORT_PAIRBONDRELATIONSHIPS_FULFILLED", payload: response.data})
        // after running import, refresh the store.
        // TODO: recieve the data through the response.data and append that information to the store.
        dispatch(fetchPeople());
        dispatch(fetchParentalRels());
        dispatch(fetchPairBondRels())
        dispatch(fetchStagedParentalRels());
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

        dispatch({type: "UPDATE_STAGEDPARENTALREL"});
        axios.post(config.api_url + '/api/v2/staging/parentalrel/update', updateRel1, getAxiosConfig())
          .then((response) => {
            dispatch({type: "UPDATE_STAGEDPARENTALREL_FULFILLED", payload: response.data});
          })
          .catch((err) => {
            dispatch({type: "UPDATE_STAGEDPARENTALREL_REJECTED", payload: err});
          })

        dispatch({type: "UPDATE_STAGEDPARENTALREL"});
        axios.post(config.api_url + '/api/v2/staging/parentalrel/update', updateRel2, getAxiosConfig())
          .then((response) => {
            dispatch({type: "UPDATE_STAGEDPARENTALREL_FULFILLED", payload: response.data});
          })
          .catch((err) => {
            dispatch({type: "UPDATE_STAGEDPARENTALREL_REJECTED", payload: err});
          })
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
				dispatch({type: "CREATE_EVENT"});
				axios.post(config.api_url + "/api/v2/event/create", bodyBirth, getAxiosConfig())
					.then((response) => {
						dispatch({type: "CREATE_EVENT_FULFILLED", payload: response.data})
					})
					.catch((err) => {
						dispatch({type: "CREATE_EVENT_REJECTED", payload: err})
					})

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
					dispatch({type: "CREATE_EVENT"});
					axios.post(config.api_url + "/api/v2/event/create", bodyDeath, getAxiosConfig())
						.then((response) => {
							dispatch({type: "CREATE_EVENT_FULFILLED", payload: response.data})
						})
						.catch((err) => {
							dispatch({type: "CREATE_EVENT_REJECTED", payload: err})
						})
					}

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

        dispatch({type: "UPDATE_STAGINGPERSON"});
        axios.post(config.api_url + '/api/v2/staging/person/update', bodyUpdate1, getAxiosConfig())
          .then((response) => {
            dispatch({type: "UPDATE_STAGINGPERSON_FULFILLED", payload: response.data});
          })
          .catch((err) => {
            dispatch({type: "UPDATE_STAGINGPERSON_REJECTED", payload: err});
          })

        dispatch({type: "UPDATE_STAGINGPERSON"});
        axios.post(config.api_url + '/api/v2/staging/person/update', bodyUpdate2, getAxiosConfig())
          .then((response) => {
            dispatch({type: "UPDATE_STAGINGPERSON_FULFILLED", payload: response.data});
          })
          .catch((err) => {
            dispatch({type: "UPDATE_STAGINGPERSON_REJECTED", payload: err});
          })

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

        dispatch({type: "UPDATE_STAGINGPAIRBONDREL"});
        axios.post(config.api_url + '/api/v2/staging/pairbondrel/update', updateRel1, getAxiosConfig())
          .then((response) => {
            dispatch({type: "UPDATE_STAGINGPAIRBONDREL_FULFILLED", payload: response.data});
          })
          .catch((err) => {
            dispatch({type: "UPDATE_STAGINGPAIRBONDREL_REJECTED", payload: err});
          })

        dispatch({type: "UPDATE_STAGINGPAIRBONDREL"});
        axios.post(config.api_url + '/api/v2/staging/pairbondrel/update', updateRel2, getAxiosConfig())
          .then((response) => {
            dispatch({type: "UPDATE_STAGINGPAIRBONDREL_FULFILLED", payload: response.data});
          })
          .catch((err) => {
            dispatch({type: "UPDATE_STAGINGPAIRBONDREL_REJECTED", payload: err});
          })
      })
    .catch((err) => {
      dispatch({type: "CREATE_PAIRBONDREL_REJECTED", payload: err})
    })
  }
}
