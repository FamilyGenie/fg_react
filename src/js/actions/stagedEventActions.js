import axios from 'axios';

import config from '../config.js';
import { getAxiosConfig } from './actionFunctions';


export function fetchStagedEvents() {
  return function(dispatch) {
    dispatch({type: 'FETCH_STAGINGEVENTS'});
    axios.get(config.api_url + '/api/v2/staging/events', getAxiosConfig())
      .then((response) => {
        dispatch({ type: 'FETCH_STAGINGEVENTS_FULFILLED', payload: response.data })
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_STAGINGEVENTS_REJECTED', payload: err })
      })
  }
}
