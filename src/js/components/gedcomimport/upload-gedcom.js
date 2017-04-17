import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import cookie from "react-cookie";
import Dropzone from 'react-dropzone';
import { hashHistory } from 'react-router';

import config from "../../config.js";
import { importPeopleAndEvents } from '../../actions/importActions';

const fgtoken = cookie.load('fg-access-token');

@connect(
  (store, ownProps) => {
    return {
      ownProps,
      store,
    }
  },
  (dispatch) => {
    return {
      importPeopleAndEvents: () => {
        dispatch(importPeopleAndEvents())
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
            alert('File Upload Successful, redirecting to Import Dashboard');
            hashHistory.push('/importhome/')
          } else {
            alert('File Upload Unsuccessful');
          }
        }
      }
      this.xhr_post(xhr, config.api_url + '/uploads', formData)
    }

    importPeopleAndEvents = () => {
      this.props.importPeopleAndEvents();
      alert('You have imported ' + this.props.store.stagedPeople.length + ' new documents')
      hashHistory.push('/importhome/')
    }

    render = () => {
      return (
        <div class="container" style={{marginTop: '100px'}}>
          <Dropzone onDrop={this.onDrop}>
            <div>
              <p>Drop a file or click to browse</p>
              <p>This currently only accepts files from Ancestry.com</p>
            </div>
          </Dropzone>
          <button onClick={this.importPeopleAndEvents}> Run Import </button>
        </div>
      );
    }
}
