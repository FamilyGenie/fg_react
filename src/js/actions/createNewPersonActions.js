// import axios from 'axios';

// import config from '../config.js';
// import { getAxiosConfig } from './actionFunctions';

export function newPerson() {
  var newPerson = {
    // id: newChild._id,
    modalIsOpen: true,
  };
  // dispatching this will make the newPersonModal open
  return (dispatch) => {
    dispatch({type: "SET_NEWPERSON", payload: newPerson});
  }
}
