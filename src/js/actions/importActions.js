import axios from "axios";
import cookie from "react-cookie";
import { createEvent } from "./eventsActions";
import { fetchPeople } from "./peopleActions";
import { fetchStagedPeople } from "./stagedPeopleActions";
import { fetchEvents } from './eventsActions';
import { fetchStagedEvents } from './stagedEventActions';

import config from "../config.js";

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
	headers: {'x-access-token': fgtoken}
};

export function runImport() {

  // send an empty body object
  const body = {};

  return (dispatch) => {
    dispatch({type: "RUN_IMPORT"});
    axios.post(config.api_url + "/api/v2/autoimport", body, axiosConfig)
      .then((response) => {
        dispatch({type: "RUN_IMPORT_FULFILLED", payload: response.data})
        // after running import, refresh the store.
        // TODO: recieve the data through the response.data and append that information to the store.
        dispatch(fetchPeople());
        dispatch(fetchEvents());
        dispatch(fetchStagedPeople());
        dispatch(fetchStagedEvents());
      })
      .catch((err) => {
        dispatch({type: "RUN_IMPORT_REJECTED", payload: err})
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
		axios.post(config.api_url + "/api/v2/person/create", body, axiosConfig)
			.then((response) => {
				dispatch({type: "CREATE_PERSON_FULFILLED", payload: response.data})
				// do post for event create for birthDate, but only
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
				axios.post(config.api_url + "/api/v2/event/create", bodyBirth, axiosConfig)
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
					axios.post(config.api_url + "/api/v2/event/create", bodyDeath, axiosConfig)
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
        axios.post(config.api_url + '/api/v2/staging/person/update', bodyUpdate1, axiosConfig)
          .then((response) => {
            dispatch({type: "UPDATE_STAGINGPERSON_FULFILLED", payload: response.data});
          })
          .catch((err) => {
            dispatch({type: "UPDATE_STAGINGPERSON_REJECTED", payload: err});
          })

        dispatch({type: "UPDATE_STAGINGPERSON"});
        axios.post(config.api_url + '/api/v2/staging/person/update', bodyUpdate2, axiosConfig)
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

