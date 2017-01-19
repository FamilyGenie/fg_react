import axios from 'axios';
import cookie from 'react-cookie';

import config from '../config.js';

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
  headers: {'x-access-token': fgtoken}
};

export function newPerson() {

  const body = { object: {} };
  var newChild;
  
  // create a new blank person record for a child
  return (dispatch) => {
    dispatch({type: "CREATE_PERSON"});
    axios.post(config.api_url + '/api/v2/person/create', body, axiosConfig)
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
        axios.post(config.api_url + '/api/v2/event/create', birthBody, axiosConfig)
          .then((response) => {
            dispatch({type: "CREATE_EVENT_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "CREATE_EVENT_REJECTED", payload: err})
          })

        const fatherRelBody = {
          object: {
            child_id: newChild._id,
            relationshipType: 'Father',
            subType: 'Biological',
          }
        }

        const motherRelBody = {
          object: {
            child_id: newChild._id,
            relationshipType: 'Mother',
            subType: 'Biological',
          }
        }

        // create two parent record for mother and father because we don't trust people without parents
        dispatch({type: "CREATE_PARENTALREL"});
        axios.post(config.api_url + '/api/v2/parentalrel/create', fatherRelBody, axiosConfig)
          .then((response) => {
            dispatch({type: "CREATE_PARENTALREL_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "CREATE_PARENTALREL_REJECTED", payload: err})
          })

        dispatch({type: "CREATE_PARENTALREL"});
        axios.post(config.api_url + '/api/v2/parentalrel/create', motherRelBody, axiosConfig)
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
          // make newPerson accessible from the store
          dispatch({type: "SET_NEWPERSON", payload: newPerson});
          
      })
      .catch((err) => {
      dispatch({type: "CREATE_PERSON_REJECTED", payload: err})
      })

  }
}
