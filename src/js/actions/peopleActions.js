import axios from "axios";
import cookie from "react-cookie";

import config from "../config.js";

// cookie.save('fg-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIl9pZCI6IjU3ZjUzNmI4MGU2NjAzZDU1ODYwMmY3NCIsIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7ImFjdGl2ZSI6ImluaXQiLCJfX3YiOiJpbml0IiwidXNlck5hbWUiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwiZmlyc3ROYW1lIjoiaW5pdCIsImxhc3ROYW1lIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiYWN0aXZlIjp0cnVlLCJ1c2VyTmFtZSI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsImZpcnN0TmFtZSI6dHJ1ZSwibGFzdE5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJhY3RpdmUiOnRydWUsIl9fdiI6MCwidXNlck5hbWUiOiJ0ZXN0QHRlc3QuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkUE1vL3I2TTVvb08xWGxzV0Y5ME4udWMxT21OREEuN25SbGk3N1JtRjduUEkvcWNnQlg4S0MiLCJmaXJzdE5hbWUiOiJmbmFtZSIsImxhc3ROYW1lIjoibG5hbWUiLCJfaWQiOiI1N2Y1MzZiODBlNjYwM2Q1NTg2MDJmNzQifSwiX3ByZXMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W251bGwsbnVsbF0sIiRfX29yaWdpbmFsX3ZhbGlkYXRlIjpbbnVsbF0sIiRfX29yaWdpbmFsX3JlbW92ZSI6W251bGxdfSwiX3Bvc3RzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W10sIiRfX29yaWdpbmFsX3JlbW92ZSI6W119LCJpYXQiOjE0ODE2Njg1MTJ9.T2m2BYENeXkyqnLcCnNKcnxoz6aHg26Zf1W3ynGUtQA');
// cookie.save('fg-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIl9pZCI6IjU3ZjUzNmI4MGU2NjAzZDU1ODYwMmY3NCIsIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7ImFjdGl2ZSI6ImluaXQiLCJfX3YiOiJpbml0IiwidXNlck5hbWUiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwiZmlyc3ROYW1lIjoiaW5pdCIsImxhc3ROYW1lIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiYWN0aXZlIjp0cnVlLCJ1c2VyTmFtZSI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsImZpcnN0TmFtZSI6dHJ1ZSwibGFzdE5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJhY3RpdmUiOnRydWUsIl9fdiI6MCwidXNlck5hbWUiOiJ0ZXN0QHRlc3QuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkUE1vL3I2TTVvb08xWGxzV0Y5ME4udWMxT21OREEuN25SbGk3N1JtRjduUEkvcWNnQlg4S0MiLCJmaXJzdE5hbWUiOiJmbmFtZSIsImxhc3ROYW1lIjoibG5hbWUiLCJfaWQiOiI1N2Y1MzZiODBlNjYwM2Q1NTg2MDJmNzQifSwiX3ByZXMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W251bGwsbnVsbF0sIiRfX29yaWdpbmFsX3ZhbGlkYXRlIjpbbnVsbF0sIiRfX29yaWdpbmFsX3JlbW92ZSI6W251bGxdfSwiX3Bvc3RzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W10sIiRfX29yaWdpbmFsX3JlbW92ZSI6W119LCJpYXQiOjE0ODA3ODk2NzF9.qHOq4Cx6xAAGO7ji00esyLC-pQRv4RI_oNpdeVBtjrU');
const fgtoken = cookie.load('fg-access-token');

var axiosConfig = {
  headers: {'x-access-token': fgtoken}
};

export function fetchPeople() {
  return function(dispatch) {
    axios.get(config.api_url + "/people", axiosConfig)
      .then((response) => {
        console.log(response.data);
        dispatch({type: "FETCH_PEOPLE_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "FETCH_PEOPLE_REJECTED", payload: err})
      })
  }
}

export function addPerson(id, text) {
  return {
    type: 'ADD_PERSON',
    payload: {
      id,
      text,
    },
  }
}

export function updatePerson(_id, field, value) {
  return {
    type: 'UPDATE_PERSON',
    payload: {
      _id,
      field,
      value
    },
  }
}

export function deletePerson(id) {
  return { type: 'DELETE_PERSON', payload: id}
}
