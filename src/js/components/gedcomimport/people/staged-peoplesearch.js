import React from 'react';
import { connect } from 'react-redux';
// import HistoryBar from '../historybar/historybar';
import StagedPeopleSearchLineItem from './staged-peoplesearch-lineitem';

@connect(
  (store, ownProps) => {
    return {
      stagedPeople: store.stagedPeople.stagedPeople.filter(function(p) {
        return (!p.ignore)
      }),
    };
})

export default class StagedPeopleSearch extends React.Component {
  render = () => {
    const { stagedPeople } = this.props;

    const mappedStagedPeople = stagedPeople.map(stagedPerson =>
      <StagedPeopleSearchLineItem stagedPerson={stagedPerson} key={stagedPerson._id}/>
    );

    return (
    <div class="mainDiv">
      <div class="header-div">
        <h1 class="family-header"> Duplicate Review </h1>
      </div>
      <div class="staged-container">
        <div class='staged-header-container'>
          <div class="staged-name-div">
            <p>Name</p>
          </div>
          <div class="staged-sex">
            <p>Sex</p>
          </div>
          <div class="stagedHB">
            <p>Date of Birth</p>
          </div>
          <div class="stagedHD">
            <p>Date of Death</p>
          </div>
          <div class="stagedHeaderReview">
            <p>Review</p>
          </div>
        </div>
        <div class="staged-people-list">
          {mappedStagedPeople}
        </div>
      </div>
    </div>);
  }
}
