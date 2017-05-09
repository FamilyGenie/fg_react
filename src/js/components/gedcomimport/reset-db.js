import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { hashHistory } from 'react-router';
import AlertContainer from 'react-alert';

import {  clearSavedRecords, clearStagedRecords, importPeopleAndEvents, importRelationships } from '../../actions/importActions';

import config from '../../config.js';
import { getAxiosConfig } from '../../actions/actionFunctions';

// import cookie from "react-cookie";
// const fgtoken = cookie.load('fg-access-token');

@connect(
  (store, ownProps) => {
    return {
      stagedPeople: store.stagedPeople.stagedPeople,
      stagedEvents: store.stagedEvents.stagedEvents,
      stagedParentalRels: store.stagedParentalRels.stagedParentalRels,
      stagedPairBondRels: store.stagedPairBondRels.stagedPairBondRels,
    }
  },
  (dispatch) => {
    return {
      clearAllRecords: () => {
        dispatch(clearStagedRecords(true));
      },
      importAllRecords: () => {
        dispatch(importPeopleAndEvents(true));
      }
    }
  }
)

export default class ResetDatabase extends React.Component {

   alertOptions = {
      offset: 15,
      position: 'bottom left',
      theme: 'light',
      time: 0,
      transition: 'scale'
    };

  // this is specifically for the gedcom file upload process
  xhr_post = (xhrToSend, url, formData) => {
      xhrToSend.open("POST", url, true);
      xhrToSend.setRequestHeader("x-access-token", getAxiosConfig().headers['x-access-token']);
      xhrToSend.send(formData);
  }

  onDrop = (files) => {

    const { stagedPeople, stagedEvents, stagedParentalRels, stagedPairBondRels } = this.props;

    if ( stagedPeople.length > 0 || stagedEvents.length > 0 || stagedParentalRels.length > 0 || stagedPairBondRels.length > 0 ) {
      // use a confirmation box and if 'OK' then clear records before uploading
      alert('You must clear your imported records before uploading a new file. \n Nothing will be uploaded at this time.');
      return;
    }

    else {
      var formData = new FormData();
      var xhr = new XMLHttpRequest();
      formData.append('gedcom', files[0]);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // msg.show('File upload successful. You should now click \'Run Import\'.', { type: 'success' })
            alert('File upload successful. You should now click Run Import.');

            // TODO reload the store after processes have completed
          } else {
            // msg.show('File upload unsuccessful', { type: 'error' })
            alert('File upload unsuccessful. Please contact support if you need assistance.');

          }
        }
      }
      this.xhr_post(xhr, config.api_url + '/uploads', formData)
    }

  }

  clearAllRecords = () => {
    let clear = confirm('WARNING: This will delete ALL records that you have saved.\nThere is no going back from this.\nAre you sure you want to continue?');
    if (clear) {
      this.props.clearAllRecords();
    }
  }

  importAllRecords = () => {
    this.props.importAllRecords();
  }

  render = () => {

    return (
    <div class="mainImport">
      <div class="header-div">
        <h1 class="family-header">Reset Your DataBase</h1>
      </div>
      <div class='import-content'>

        <div class="import-row">
          <div class="import-step">
            <p>1</p>
          </div>
          <div class="import-step-content">
            <div class="step-instruction">
              <h3 class="step-header">Delete All Records</h3>
            </div>
            <div class="step-action">
              <button class="btn button3" onClick={this.clearAllRecords}> DELETE </button>
            </div>
          </div>
        </div>

        <div class="import-row">
          <div class="import-step">
            <p>2</p>
          </div>
          <div class="import-step-content">
            <div class="step-instruction">
              <h3 class="step-header">Upload Your Gedcom File</h3>
            </div>
            <div class="step-action">
              <div class="gedCom">
                <Dropzone class="dropzone" onDrop={this.onDrop}>
                  <div>
                    <p>Drop a file or click to browse</p>
                    <p>This currently only accepts files from Ancestry.com</p>
                  </div>
                </Dropzone>
              </div>
            </div>
          </div>
        </div>

        <div class="import-row">
          <div class="import-step">
            <p>3</p>
          </div>
          <div class="import-step-content">
            <div class="step-instruction">
              <h3 class="step-header">Import New Records</h3>
            </div>
            <div class="step-action">
              <button class="btn button3" onClick={this.importAllRecords}> IMPORT </button>
            </div>
          </div>
        </div>

      </div>
      <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
    </div>
    )
  }

}
