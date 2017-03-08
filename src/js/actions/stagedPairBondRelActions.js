import axios from 'axios';

import config from '../config.js';
import { getAxiosConfig } from './actionFunctions';

export function fetchStagedPairBondRels() {

  return function(dispatch) {
    dispatch({type: 'FETCH_STAGINGPAIRBONDRELS'});
    axios.get(config.api_url + '/api/v2/staging/pairbondrels', getAxiosConfig())
      .then((response) => {
        dispatch({type: 'FETCH_STAGINGPAIRBONDRELS_FULFILLED', payload: response.data})
      })
        .catch((err) => {
          dispatch({type: 'FETCH_STAGINGPAIRBONDRELS_REJECTED', payload: err})
        })
  }
}

export function updateStagedPairBondRel(_id, field, value) {
  const body = {
    object: {
      _id,
      field,
      value
    }
  };

  return (dispatch) => {
    dispatch({type: 'UPDATE_STAGEDPAIRBONDREL'});
    axios.post(config.api_url + '/api/v2/staging/pairbondrel/update', body, getAxiosConfig())
      .then((response) => {
        dispatch({type: 'UPDATE_STAGEDPAIRBONDREL_FULFILLED', payload: response.data})
      })
      .catch((err) => {
        dispatch({type: 'UPDATE_STAGEDPAIRBONDREL_REJECTED', payload: err})
      })
  }
}
