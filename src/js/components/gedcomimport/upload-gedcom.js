import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import cookie from "react-cookie";
import Dropzone from 'react-dropzone';
import { runImport } from '../../actions/importActions';

cookie.save('fg-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIl9pZCI6IjU3ZjUzNmI4MGU2NjAzZDU1ODYwMmY3NCIsIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7ImFjdGl2ZSI6ImluaXQiLCJfX3YiOiJpbml0IiwidXNlck5hbWUiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwiZmlyc3ROYW1lIjoiaW5pdCIsImxhc3ROYW1lIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiYWN0aXZlIjp0cnVlLCJ1c2VyTmFtZSI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsImZpcnN0TmFtZSI6dHJ1ZSwibGFzdE5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJhY3RpdmUiOnRydWUsIl9fdiI6MCwidXNlck5hbWUiOiJ0ZXN0QHRlc3QuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkUE1vL3I2TTVvb08xWGxzV0Y5ME4udWMxT21OREEuN25SbGk3N1JtRjduUEkvcWNnQlg4S0MiLCJmaXJzdE5hbWUiOiJmbmFtZSIsImxhc3ROYW1lIjoibG5hbWUiLCJfaWQiOiI1N2Y1MzZiODBlNjYwM2Q1NTg2MDJmNzQifSwiX3ByZXMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W251bGwsbnVsbF0sIiRfX29yaWdpbmFsX3ZhbGlkYXRlIjpbbnVsbF0sIiRfX29yaWdpbmFsX3JlbW92ZSI6W251bGxdfSwiX3Bvc3RzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W10sIiRfX29yaWdpbmFsX3JlbW92ZSI6W119LCJpYXQiOjE0ODAzMDE4NDN9.GPukUe3_LyhAuvJAJzXini58fOD5Vkr9G20bXoqWCN0')

const fgtoken = cookie.load('fg-access-token');

@connect(
  (store, ownProps) => {
    return ownProps;
  },
  (dispatch) => {
    return {
      runImport: () => {
        dispatch(runImport())
      }
    }
  }
)

export default class GedcomImport extends React.Component {


    // this is specifically for the gedcom file upload process
    xhr_post(xhrToSend, url, formData) {
        xhrToSend.open("POST", url, true);
        xhrToSend.setRequestHeader("x-access-token", fgtoken);
        xhrToSend.send(formData);
    }

    onDrop = (files) => {
      var formData = new FormData();
      var xhr = new XMLHttpRequest();
      formData.append('gedcom', files[0]);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            alert('File Upload Successful');
          } else {
            alert('File Upload Unsuccessful');
          }
        }
      }
      this.xhr_post(xhr, 'http://localhost:3500/uploads', formData)
    }

    runImport = () => {
      this.props.runImport();
    }

    render = () => {
      return (
        <div>
        <Dropzone onDrop={this.onDrop}>
          <div>
            Drop a file or click to browse
          </div>
        </Dropzone>
        <button onClick={this.runImport}> Run Import </button>
        </div>

      );
    }
}
