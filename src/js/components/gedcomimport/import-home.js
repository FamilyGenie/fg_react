import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import cookie from "react-cookie";
import Dropzone from 'react-dropzone';
import { hashHistory } from 'react-router';
import { runImport } from '../../actions/importActions';

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
      }
    }
  }
)
export default class ImportDashboard extends React.Component {

  goToStagedPeopleSearch = () => {
    hashHistory.push('/stagedpeoplesearch');
  }

  goToUploadPage = () => {
    hashHistory.push('/gedcomimport');
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
          alert('File Upload Successful, redirecting to Import Dashboard');
          hashHistory.push('/importhome/')
        } else {
          alert('File Upload Unsuccessful');
        }
      }
    }
    this.xhr_post(xhr, 'http://localhost:3500/uploads', formData)
  }

  runImport = () => {
    this.props.runImport();
    alert('You have imported ' + this.props.store.stagedPeople.length + ' new documents')
    hashHistory.push('/importhome/')
  }
  // <button onClick={this.goToUploadPage}> Upload Gedcom Files </button>

  render = () => {

    return (
    <div class="main-div">
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
                <button class="btn button3" onClick={this.runImport}> Run Import </button>
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
              <h3 class="step-header">Review People</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                <div class="action-row">
                  <label> Ready to be Imported: </label>
                  <p>{this.props.peopleRemaining.length}</p>
                </div>
                <div class="action-row">
                  <label>  Already Imported: </label>
                  <p>{this.props.peopleImported.length}</p>
                </div>
                <button class="btn button3 import-button" onClick={this.goToStagedPeopleSearch}>Review</button>
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
              <h3 class="step-header">Review Events</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                <div class="action-row">
                  <label> Ready to be Imported: </label>
                  <p>{this.props.eventsRemaining.length}</p>
                </div>
                <div class="action-row">
                  <label>  Already Imported: </label>
                  <p>{this.props.eventsImported.length}</p>
                </div>
                <button class="btn button3 import-button" onClick={this.goToStagedEventSearch}>Review</button>
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
              <h3 class="step-header">Review Parents</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                <div class="action-row">
                  <label> Ready to be Imported: </label>
                  <p>{this.props.eventsRemaining.length}</p>
                </div>
                <div class="action-row">
                  <label>  Already Imported: </label>
                  <p>{this.props.eventsImported.length}</p>
                </div>
                <button class="btn button3 import-button" onClick={this.goToStagedEventSearch}>Review</button>
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
              <h3 class="step-header">Review Pairbonds</h3>
            </div>
            <div class="step-action">
              <div class="action-content">
                <div class="action-row">
                  <label> Ready to be Imported: </label>
                  <p>{this.props.eventsRemaining.length}</p>
                </div>
                <div class="action-row">
                  <label>  Already Imported: </label>
                  <p>{this.props.eventsImported.length}</p>
                </div>
                <button class="btn button3 import-button" onClick={this.goToStagedEventSearch}>Review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}
