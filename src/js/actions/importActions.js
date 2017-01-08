import axios from "axios";
import cookie from "react-cookie";
import { createEvent } from "./eventsActions";

import config from "../config.js";

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
	headers: {'x-access-token': fgtoken}
};

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
						console.log('in importAction-createPerson-createEvent with: ', response.data);
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
					console.log('in import_Person, about to call create_event for death ', bodyDeath);
					dispatch({type: "CREATE_EVENT"});
					axios.post(config.api_url + "/api/v2/event/create", bodyDeath, axiosConfig)
						.then((response) => {
							console.log('in importAction-createPerson-createEvent with: ', response.data);
							dispatch({type: "CREATE_EVENT_FULFILLED", payload: response.data})
						})
						.catch((err) => {
							dispatch({type: "CREATE_EVENT_REJECTED", payload: err})
						})
					}
			})
			.catch((err) => {
				console.log('create_person.catch: ', err);
				dispatch({type: "CREATE_PERSON_REJECTED", payload: err})
			})
	}
}
