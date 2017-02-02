import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import HistoryBar from '../historybar/historybar';

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

  goToUploadPage = () => {
    hashHistory.push('/gedcomimport');
  }

  render = () => {

    return (
    <div class="main-div">
      <HistoryBar/>
      <div class="header-div">
        <h1 class="family-header"> Import Dashboard </h1>
      </div>
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
