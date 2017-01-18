import axios from 'axios';
import cookie from 'react-cookie';

import config from '../config.js';

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
  headers: {'x-access-token': fgtoken}
};

export function newPerson() {

  const body = { object: {} }
  
  return (dispatch) => {
    dispatch({type: "CREATE_NEWPERSON"});
    axios.post(config.api_url + '/api/v2/newperson/create', body,axiosConfig)
      .then((response) => {
        dispatch({type: "CREATE_NEWPERSON_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "CREATE_NEWPERSON_REJECTED", payload: err})
      })
  }
}
