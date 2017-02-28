import axios from 'axios';

import config from '../config.js';
import { getAxiosConfig } from './actionFunctions';

export function createNewPerson(person, birthEvent, parentRel1, parentRel2) {
	// create the body in the format that the API is expecting
  	var body = { object: person };
  	var newChild;

  // create a new blank person record for a child
  return (dispatch) => {
    dispatch({type: "CREATE_PERSON"});
    axios.post(config.api_url + '/api/v2/person/create', body, getAxiosConfig())
      .then((response) => {
        newChild = response.data;
        dispatch({type: "CREATE_PERSON_FULFILLED", payload: response.data})

        birthEvent.person_id = newChild._id;
        body = {object: birthEvent};

        // create a blank birth record for the newly created person because we don't trust people without a birthdate.
        dispatch({type: "CREATE_EVENT"});
        axios.post(config.api_url + '/api/v2/event/create', body, getAxiosConfig())
          .then((response) => {
            dispatch({type: "CREATE_EVENT_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "CREATE_EVENT_REJECTED", payload: err})
          });

        // create a parental rel record only if the user selected one
        if (parentRel1.parent_id) {

	        // the newly created person's id is passed to the createParentalRel action, as the child_id.
	        parentRel1.child_id = newChild._id;
	        body = {object: parentRel1};
	        dispatch({type: "CREATE_PARENTALREL"});
	        axios.post(config.api_url + '/api/v2/parentalrel/create', body, getAxiosConfig())
	          .then((response) => {
	            dispatch({type: "CREATE_PARENTALREL_FULFILLED", payload: response.data})
	          })
	          .catch((err) => {
	            dispatch({type: "CREATE_PARENTALREL_REJECTED", payload: err})
	          })
        }

        // create a parental rel record only if the user selected one
        if (parentRel2.parent_id) {
	        // the newly created person's id is passed to the createParentalRel action, as the child_id.
	        parentRel2.child_id = newChild._id;
	        body = {object: parentRel2};
	        dispatch({type: "CREATE_PARENTALREL"});
	        axios.post(config.api_url + '/api/v2/parentalrel/create', body, getAxiosConfig())
	          .then((response) => {
	            dispatch({type: "CREATE_PARENTALREL_FULFILLED", payload: response.data})
	          })
	          .catch((err) => {
	            dispatch({type: "CREATE_PARENTALREL_REJECTED", payload: err})
	          })
        }

        // close the modal here
        dispatch({type: "CLOSE_NEWPERSON_MODAL"});

      })
      .catch((err) => {
      dispatch({type: "CREATE_PERSON_REJECTED", payload: err})
      })

  }
}
