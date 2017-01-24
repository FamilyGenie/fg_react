import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

@connect(
  (store, ownProps) => {
  return {
    stagedPeople: store.stagedPeople.stagedPeople,
    peopleRemaining : store.stagedPeople.stagedPeople.filter(function(p) {
      return (!p.ignore || p.ignore === false);
    }),
    totalPeople : store.stagedPeople.stagedPeople.filter(function(t) {
      return (t.ignore === true);
    }),
    /*
     * stagedEvents: store.stagedEvents.stagedEvents,
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

  render = () => (<div>
      <h1> Import Dashboard </h1>
      <button onClick={this.goToUploadPage}> Upload Gedcom Files </button>
      <div class='container'>
        <div class='col-md-6'>
          <h4
            onClick={this.goToStagedPeopleSearch}
          > 
            People Imports 
          </h4>
          <label> Need To Be Imported: </label>
          <p>{this.props.peopleRemaining.length}</p>
          <label>  Already Imported: </label>
          <p>{this.props.totalPeople.length}</p>
        </div>
        <div class='col-md-6'>
          <h4> Event Imports </h4>
          <label> Need To Be Imported: </label>
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
    </div>)
}
