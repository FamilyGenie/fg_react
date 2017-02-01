import axios from 'axios';
import cookie from 'react-cookie';

import config from '../config.js';

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
  headers : {'x-access-token': fgtoken}
};

export function fetchStagedEvents() {
  return function(dispatch) {
    dispatch({type: 'FETCH_STAGINGEVENTS'});
    axios.get(config.api_url + '/api/v2/staging/events', axiosConfig)
      .then((response) => {
        dispatch({ type: 'FETCH_STAGINGEVENTS_FULFILLED', payload: response.data })
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_STAGINGEVENTS_REJECTED', payload: err })
      })
  }
}
