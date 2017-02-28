import axios from 'axios';

import { createEvent } from './eventsActions';
import { createParentalRel } from './parentalRelsActions';

import config from '../config.js';
import { getAxiosConfig } from './actionFunctions';

export function createNewPerson(person, birthEvent, parentRel1, parentRel2, starFromMap) {
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

        // create a birth record for the newly created person, passing in all the values from the modal - which gave us birthEvent, and using the newChild._id - for the person we just created.
        dispatch({type: "CREATE_EVENT"});
        dispatch(createEvent(birthEvent.eventDateUser, birthEvent.eventDate, newChild._id, birthEvent.eventType, birthEvent.eventPlace));

        // create a parental rel record only if the user selected one
        if (parentRel1.parent_id) {
	        // the newly created person id is passed to the createParentalRel action, as the child_id, and we create the parental rel record with the parent selected by the user in the modal.
	        dispatch({type: "CREATE_PARENTALREL"});
          dispatch(createParentalRel(newChild._id, parentRel1.parent_id, parentRel1.relationshipType, parentRel1.subType, parentRel1.startDateUser, parentRel1.startDate, parentRel1.endDateUser, parentRel1.endDate));
        }

        // create a parental rel record only if the user selected one
        if (parentRel2.parent_id) {
          // the newly created person id is passed to the createParentalRel action, as the child_id, and we create the parental rel record with the parent selected by the user in the modal.
          dispatch({type: "CREATE_PARENTALREL"});
          dispatch(createParentalRel(newChild._id, parentRel2.parent_id, parentRel2.relationshipType, parentRel2.subType, parentRel2.startDateUser, parentRel2.startDate, parentRel2.endDateUser, parentRel2.endDate));
        }

        // if the newPerson modal passes in starFromMap_id, that means that the newPerson modal was opened by the FamilyMap component, and we then need to make this newly created person the parent of the star of the map. because the only time the Map would call newPerson modal is if it is to create a biological parent for the star.
        if (starFromMap) {
          dispatch({type: "CREATE_PARENTALREL"});
          dispatch(createParentalRel(starFromMap._id, newChild._id, (person.sexAtBirth === 'M' ? 'Father' : 'Mother'), 'Biological', birthEvent.eventDateUser, birthEvent.eventDate));
        }

        // close the modal here
        dispatch({type: "CLOSE_NEWPERSON_MODAL"});

      })
      .catch((err) => {
      dispatch({type: "CREATE_PERSON_REJECTED", payload: err})
      })

  }
}
