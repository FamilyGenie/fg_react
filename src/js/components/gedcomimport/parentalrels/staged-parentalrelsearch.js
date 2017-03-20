import React from 'react';
import { connect } from 'react-redux';
import StagedParentalRelSearchLineItem from './staged-parentalrelsearch-lineitem';

@connect(
  (store, ownProps) => {
    return {
      stagedParentalRels:
        store.stagedParentalRels.stagedParentalRels.filter((p) => {
          return (!p.ignore)
        }),
    };
})

export default class StagedParentalRelSearch extends React.Component {
  componentDidMount = () => {
    $(window).scrollTop(0);
  }

  render = () => {

    const { stagedParentalRels } = this.props;
    console.log('in Sparentsearch RENDER with: ', stagedParentalRels)

    const mappedStagedParentalRels = stagedParentalRels.map((stagedParentalRel) => {
      return ( <StagedParentalRelSearchLineItem stagedParentalRel={stagedParentalRel} key={stagedParentalRel._id}/> )
    });

    // console.log('in staged-parentalrelsearch with:', stagedParentalRels, mappedStagedParentalRels)

    return (
      <div class='mainDiv'>
        <div class="header-div">
          <h1 class="family-header"> Duplicate Parent Review </h1>
        </div>
        <div class="staged-container">
          <div class="staged-header-container">
            <div class="stagedParentHeader">
              <p>Parent</p>
            </div>
            <div class="stagedChildHeader">
              <p>Child</p>
            </div>
            <div class="stagedType">
              <p>Type</p>
            </div>
            <div class="stagedStartDate">
              <p>Start Date</p>
            </div>
            <div class="stagedPBHeaderReview">
              <p>Review</p>
            </div>
          </div>
          <div class='staged-people-list'>
            {mappedStagedParentalRels}
        </div>
      </div>
    </div>
    )
  }
}
