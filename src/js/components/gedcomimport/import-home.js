import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { hashHistory } from 'react-router';
import { runImport, importRelationships } from '../../actions/importActions';
import { fetchStagedPeople } from '../../actions/stagedPeopleActions';
import { fetchStagedEvents } from '../../actions/stagedEventActions';
import AlertContainer from 'react-alert';

import cookie from "react-cookie";

import config from '../../config.js';
const fgtoken = cookie.load('fg-access-token');



@connect(
  (store, ownProps) => {
    return {
      stagedPeople: store.stagedPeople.stagedPeople,
      peopleImported : store.stagedPeople.stagedPeople.filter(function(p) {
        return (p.ignore === true);
      }),
      peopleRemaining: store.stagedPeople.stagedPeople.filter(function(p) {
        return (!p.ignore);
      }),
      stagedEvents: store.stagedEvents.stagedEvents,
      eventsImported: store.stagedEvents.stagedEvents.filter(function(e) {
        return (e.ignore === true);
      }),
      eventsRemaining: store.stagedEvents.stagedEvents.filter(function(e) {
        return (!e.ignore);
      }),
      ownProps,
      store,
      /*
       * stagedParentalRels: store.stagedParentalRels.stagedParentalRels,
       * stagedPairbondRels: store.stagedPairbondRels.stagedPairbondRels,
       */
    }
  },
  (dispatch) => {
    return {
      runImport: () => {
        dispatch(runImport())
      },
      importRelationships: () => {
        dispatch(importRelationships())
      },
      fetchStagedPeople: () => {
        dispatch(fetchStagedPeople())
      },
      fetchStagedEvents: () => {
        dispatch(fetchStagedEvents())
      }
    }
  }
)
export default class ImportDashboard extends React.Component {

   alertOptions = {
      offset: 15,
      position: 'bottom left',
      theme: 'light',
      time: 0,
      transition: 'scale'
    };

  goToStagedPeopleSearch = () => {
    hashHistory.push('/stagedpeoplesearch');
  }

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
          msg.show('File upload successful. You should now click \'Run Import\'.', { type: 'success' })
          // TODO reload the store after processes have completed
        } else {
          msg.show('File upload unsuccessful', { type: 'error' })
        }
      }
    }
    this.xhr_post(xhr, config.api_url + '/uploads', formData)
  }

  runImport = () => {
    this.props.runImport();
    msg.show('You have imported new documents. You should now review any duplicates before continuing.', { type: 'success' });
  }
  importRelationships = () => {
    this.props.importRelationships();
    msg.show('You have imported new relationships. You should now review them before continuing.', {type: 'success'})
  }

  render = () => {

    return (
    <div class="mainImport">
      <div class="header-div">
        <h1 class="family-header"> Import Dashboard </h1>
      </div>
      <div class='import-content'>
        <div class="import-row">
          <div class="import-step">
            <p>1</p>
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
            <p>2</p>
          </div>
          <div class="import-step-content">
            <div class="step-instruction">
              <h3 class="step-header">Import Documents</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                <button class="btn button3" onClick={this.runImport}> Run Import </button>
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
              <h3 class="step-header">Review People</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                {/*
                <div class="action-row">
                  <label> Ready to be Imported: </label>
                  <p class="actionItem">{this.props.peopleRemaining.length}</p>
                </div>
                <div class="action-row">
                  <label>  Already Imported: </label>
                  <p class="actionItem">{this.props.peopleImported.length}</p>
                </div>
                */}
                <button class="btn button3" onClick={this.goToStagedPeopleSearch}>Review</button>
              </div>
            </div>
          </div>
        </div>
        <div class="import-row">
          <div class="import-step">
            <p>4</p>
          </div>
          <div class="import-step-content">
            <div class="step-instruction">
              <h3 class="step-header">Review Events</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                {/*
                <div class="action-row">
                  <label> Ready to be Imported: </label>
                  <p class="actionItem">{this.props.eventsRemaining.length}</p>
                </div>
                <div class="action-row">
                  <label>  Already Imported: </label>
                  <p class="actionItem">{this.props.eventsImported.length}</p>
                </div>
                */}
                <button class="btn button3" onClick={this.goToStagedEventSearch}>Review</button>
              </div>
            </div>
          </div>
        </div>
        <div class="import-row">
          <div class="import-step">
            <p>5</p>
          </div>
          <div class="import-step-content">
            <div class="step-instruction">
              <h3 class="step-header">Import Relationships</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                {/*
                <div class="action-row">
                  <label> Ready to be Imported: </label>
                  <p class="actionItem">{this.props.eventsRemaining.length}</p>
                </div>
                <div class="action-row">
                  <label>  Already Imported: </label>
                  <p class="actionItem">{this.props.eventsImported.length}</p>
                </div>
                */}
                <button class="btn button3" onClick={this.importRelationships}> Run Import </button>
              </div>
            </div>
          </div>
        </div>

        <div class="import-row">
          <div class="import-step">
            <p>6</p>
          </div>
          <div class="import-step-content">
            <div class="step-instruction">
              <h3 class="step-header">Review Parents</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                <div class="action-row">
                {/*
                  <label> Ready to be Imported: </label>
                  <p class="actionItem">{this.props.eventsRemaining.length}</p>
                </div>
                <div class="action-row">
                  <label>  Already Imported: </label>
                  <p class="actionItem">{this.props.eventsImported.length}</p>
                */}
                </div>
                <button class="btn button3" onClick={this.goToStagedEventSearch}>Review</button>
              </div>
            </div>
          </div>
        </div>
        <div class="import-row">
          <div class="import-step">
            <p>7</p>
          </div>
          <div class="import-step-content">
            <div class="step-instruction">
              <h3 class="step-header">Review Pairbonds</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                <div class="action-row">
                {/*
                  <label> Ready to be Imported: </label>
                  <p class="actionItem">{this.props.eventsRemaining.length}</p>
                </div>
                <div class="action-row">
                  <label>  Already Imported: </label>
                  <p class="actionItem">{this.props.eventsImported.length}</p>
                */}
                </div>
                <button class="btn button3" onClick={this.goToStagedEventSearch}>Review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
    </div>);
  }
}
