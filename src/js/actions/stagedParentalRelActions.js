import axios from 'axios';

import config from '../config.js';
import { getAxiosConfig } from './actionFunctions';


export function fetchStagedParentalRels() {

  return (dispatch) => {
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

export function updateStagedParentalRel(_id, field, value) {
  const body = {
    object: {
      _id,
      field,
      value
    }
  };

  return (dispatch) => {
    dispatch({type: 'UPDATE_STAGEDPARENTALREL'});
    axios.post(config.api_url + '/api/v2/staging/parentalrel/update', body, getAxiosConfig())
      .then((response) => {
        dispatch({type: 'UPDATE_STAGEDPARENTALREL_FULFILLED', payload: response.data})
      })
      .catch((err) => {
        dispatch({type: 'UPDATE_STAGEDPARENTALREL_REJECTED', payload: err})
      })
  }
}
