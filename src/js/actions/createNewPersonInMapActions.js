import axios from 'axios';
import cookie from 'react-cookie';

import config from '../config.js';

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
  headers: {'x-access-token': fgtoken}
};

export function createNewPersonInMap(childFromMap_id, fName, sexAtBirth, parentalRel_Id) {

  const body = {
    object: {
      fName: fName,
      lName: '',
      sexAtBirth: sexAtBirth,
    }
  };
  var newPerson;
  // create a new blank person record for a child
  return (dispatch) => {
    dispatch({type: "CREATE_PERSON"});
    axios.post(config.api_url + '/api/v2/person/create', body, axiosConfig)
      .then((response) => {
        newPerson = response.data;
        dispatch({type: "CREATE_PERSON_FULFILLED", payload: response.data})

        const birthBody = {
          object: {
            person_id: newPerson._id,
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
          });

        // the newly created person's id is passed to the createParentalRel action, as the child_id.
        const fatherRelBody = {
          object: {
            child_id: newPerson._id,
            relationshipType: 'Father',
            subType: 'Biological',
          }
        }

        // the newly created person's id is passed to the createParentalRel action, as the child_id.
        const motherRelBody = {
          object: {
            child_id: newPerson._id,
            relationshipType: 'Mother',
            subType: 'Biological',
          }
        }

        // create two parent record for mother and father because we don't trust people without parents
        // When you create a new person record, it automatically creates the parentalRel records because we know every person came from a sperm and an egg (the biological father and mother). But we need to let the customer select who the bio father and bio mother are.
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

        // If there was a parentalRel passed into the Action, then update that record to make this newly created person the parent of the child passed in. If there was not a parentalRel passed into the Action, then create the parental rel that makes this newly created person the parent of the child in the map
        if (parentalRel_Id) {
          // update parentalRel here
          const newBody = {
            object: {
              _id: parentalRel_Id,
              field: 'parent_id',
              value: newPerson._id
            }
          };

          dispatch({type: "UPDATE_PARENTALREL"});
          axios.post(config.api_url + "/api/v2/parentalrel/update", newBody, axiosConfig)
            .then((response) => {
              dispatch({type: "UPDATE_PARENTALREL_FULFILLED", payload: response.data})
            })
            .catch((err) => {
              dispatch({type: "UPDATE_PARENTALREL_REJECTED", payload: err})
            })

        } else {
          const parentRelBody = {
            object: {
              parent_id: newPerson._id,
              child_id: childFromMap_id,
              relationshipType: (sexAtBirth === 'M' ? 'Father' : 'Mother'),
              subType: 'Biological'
            }
          };
          dispatch({type: "CREATE_PARENTALREL"});
          axios.post(config.api_url + '/api/v2/parentalrel/create', parentRelBody, axiosConfig)
            .then((response) => {
              dispatch({type: "CREATE_PARENTALREL_FULFILLED", payload: response.data})
            })
            .catch((err) => {
              dispatch({type: "CREATE_PARENTALREL_REJECTED", payload: err})
            })
        }



        // last, we want to dispatch to SET_NEWPERSON to show the modal to edit this newly created person, and pass it the of this newly created person
        newPerson = {
          id: newPerson._id,
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
