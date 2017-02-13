import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

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
      /*
       * stagedParentalRels: store.stagedParentalRels.stagedParentalRels,
       * stagedPairbondRels: store.stagedPairbondRels.stagedPairbondRels,
       */
    }
  }
)
export default class ImportDashboard extends React.Component {

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
          alert('File Upload Successful');
        } else {
          alert('File Upload Unsuccessful');
        }
      }
    }
    // TODO: Need to reference the config.js to bring in the correct server. Not good to hardcode it.
    this.xhr_post(xhr, config.api_url + '/uploads', formData)
  }

  runImport = () => {
    this.props.runImport();
    alert('You have imported ' + this.props.store.stagedPeople.length + ' new documents')
    hashHistory.push('/importhome/')
  }

  render = () => {
    
    return (<div>
      <h1> Import Dashboard </h1>
      <button onClick={this.goToUploadPage}> Upload Gedcom Files </button>
      <div class='container'>
        <div class='col-md-6'>
          <h4
            onClick={this.goToStagedPeopleSearch}
          > 
            People Imports 
          </h4>
          <label> Ready to be Imported: </label>
          <p>{this.props.peopleRemaining.length}</p>
          <label>  Already Imported: </label>
          <p>{this.props.peopleImported.length}</p>
        </div>

        <div class='col-md-6'>
          <h4> Event Imports </h4>
          <label> Ready to be Imported: </label>
            <p>{this.props.eventsRemaining.length}</p>
          <label>  Already Imported: </label>
            <p>{this.props.eventsImported.length}</p>
        </div>

      </div>

      <div class='container'>
        <div class='col-md-6'>
          <h4> Parent Imports </h4>
          <label> Need To Be Imported: </label>
        </div>
        <div class='col-md-6'>
          <h4> Pairbond Imports </h4>
          <label> Need To Be Imported: </label>
        </div>
      </div>
    </div>);
  }
}
