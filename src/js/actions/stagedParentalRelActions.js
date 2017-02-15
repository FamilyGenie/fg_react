import axios from 'axios';

import config from '../config.js';
import { getAxiosConfig } from './actionFunctions';


export function fetchStagedParentalRels() {

  return function(dispatch) {
    dispatch({type: 'FETCH_STAGINGPARENTALRELS'});
    axios.get(config.api_url + '/api/v2/staging/parentalrels', getAxiosConfig())
      .then((response) => {
        dispatch({type: 'FETCH_STAGINGPARENTALRELS_FULFILLED', payload: response.data})
      })
      .catch((err) => {
        dispatch({type: 'FETCH_STAGINGPARENTALRELS_REJECTED', payload: err})
      })
  }
}
