import axios from 'axios';
import cookie from 'react-cookie';

import config from '../config.js';

const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
  headers: {'x-access-token': fgtoken}
};

export function fetchStagedParentalRels() {

  return function(dispatch) {
    dispatch({type: 'FETCH_STAGINGPARENTALRELS'});
    axios.get(config.api_url + '/api/v2/staging/parentalrels', axiosConfig)
      .then((response) => {
        dispatch({type: 'FETCH_STAGINGPARENTALRELS_FULFILLED', payload: response.data})
      })
      .catch((err) => {
        dispatch({type: 'FETCH_STAGINGPARENTALRELS_REJECTED', payload: err})
      })
  }
}
