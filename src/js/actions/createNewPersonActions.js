import axios from 'axios';

import config from '../config.js';
import { getAxiosConfig } from './actionFunctions';

export function newPerson() {

  const body = { object: {} };
  var newChild;

  // create a new blank person record for a child
  return (dispatch) => {
    dispatch({type: "CREATE_PERSON"});
    axios.post(config.api_url + '/api/v2/person/create', body, getAxiosConfig())
      .then((response) => {
        newChild = response.data;
        dispatch({type: "CREATE_PERSON_FULFILLED", payload: response.data})

        const birthBody = {
          object: {
            person_id: newChild._id,
            eventType: 'Birth',
          }
        }

        // create a blank birth record for the newly created person because we don't trust people without a birthdate.
        dispatch({type: "CREATE_EVENT"});
        axios.post(config.api_url + '/api/v2/event/create', birthBody, getAxiosConfig())
          .then((response) => {
            dispatch({type: "CREATE_EVENT_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "CREATE_EVENT_REJECTED", payload: err})
          });

        // the newly created person's id is passed to the createParentalRel action, as the child_id.
        const fatherRelBody = {
          object: {
            child_id: newChild._id,
            relationshipType: 'Father',
            subType: 'Biological',
          }
        }

        // the newly created person's id is passed to the createParentalRel action, as the child_id.
        const motherRelBody = {
          object: {
            child_id: newChild._id,
            relationshipType: 'Mother',
            subType: 'Biological',
          }
        }

        // create two parent record for mother and father because we don't trust people without parents
        // When you create a new person record, it automatically creates the parentalRel records because we know every person came from a sperm and an egg (the biological father and mother). But we need to let the customer select who the bio father and bio mother are.
        dispatch({type: "CREATE_PARENTALREL"});
        axios.post(config.api_url + '/api/v2/parentalrel/create', fatherRelBody, getAxiosConfig())
          .then((response) => {
            dispatch({type: "CREATE_PARENTALREL_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "CREATE_PARENTALREL_REJECTED", payload: err})
          })

        dispatch({type: "CREATE_PARENTALREL"});
        axios.post(config.api_url + '/api/v2/parentalrel/create', motherRelBody, getAxiosConfig())
          .then((response) => {
            dispatch({type: "CREATE_PARENTALREL_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "CREATE_PARENTALREL_REJECTED", payload: err})
          })

          var newPerson = {
            id: newChild._id,
            modalIsOpen: true,
          };
          // dispatching this will make the newPersonModal open, and will pass it the newly created person's id.
          dispatch({type: "SET_NEWPERSON", payload: newPerson});

      })
      .catch((err) => {
      dispatch({type: "CREATE_PERSON_REJECTED", payload: err})
      })

  }
}
