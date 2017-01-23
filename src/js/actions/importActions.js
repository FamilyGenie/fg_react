import axios from "axios";
import cookie from "react-cookie";
import { createEvent } from "./eventsActions";
import { fetchPeople } from "./peopleActions";
import { fetchStagedPeople } from "./stagedPeopleActions";

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
        dispatch(fetchPeople());
        dispatch(fetchStagedPeople());
      })
      .catch((err) => {
        dispatch({type: "RUN_IMPORT_REJECTED", payload: err})
      })
  }
}

export function importPerson(fName, mName, lName, sexAtBirth, birthDate, birthPlace, deathDate, deathPlace) {

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
			})
			.catch((err) => {
				dispatch({type: "CREATE_PERSON_REJECTED", payload: err})
			})
	}
}

