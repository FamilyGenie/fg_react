import React from 'react';
import { connect } from 'react-redux';
import StagedParentalRelSearchLineItem from './staged-parentalrelsearch-lineitem';

@connect(
  (store, ownProps) => {
    return {
      stagedParentalRels: 
        store.stagedParentalRels.stagedParentalRels.filter((p) => {
          return (p.ignore === false);
        }),
    };
})

export default class StagedParentalRelSearch extends React.Component {

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
          <h1 class="family-header"></h1>
        </div>
        <div class="staged-container">
          <div class="staged-header-container">
            <div class="staged-parent">
              <p>Parent</p>
            </div>
            <div class="staged-child">
              <p>Child</p>
            </div>
            <div class="staged-start-date">
              <p>Start Date</p>
            </div>
          </div>
          <div class='staged-parentalrel-list'>
            {mappedStagedParentalRels}
        </div>
      </div>
    </div>
    )
  }
}
