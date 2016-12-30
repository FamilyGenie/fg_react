import axios from 'axios';
import cookie from 'react-cookie';

import config from '../config.js';

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
  headers: {'x-access-token': fgtoken}
};

export function fetchStagedPeople() {

  return function(dispatch) {
    dispatch({type: 'FETCH_STAGING_PEOPLE'});
    axios.get(config.api_url + '/staging/people', axiosConfig)
      .then((response) => {
        dispatch({type: 'FETCH_STAGING_PEOPLE_FULFILLED', payload: response.data})
      })
      .catch((err) => {
        dispatch({type: 'FETCH_STAGING_PEOPLE_REJECTED', payload: err})
      })
  }
}
