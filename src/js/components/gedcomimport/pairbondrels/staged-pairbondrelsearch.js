import React from 'react';
import { connect } from 'react-redux';

import StagedPairBondRelSearchLineItem from './staged-pairbondrelsearch-lineitem';

@connect(
  (store, ownProps) => {
    return {
      stagedPairBondRels:
      store.stagedPairBondRels.stagedPairBondRels.filter((p) => {
        return (!p.ignore)
      }),
    };
})

export default class StagedPairBondRelSearch extends React.Component {

  render = () => {

    const { stagedPairBondRels } = this.props;

    const mappedStagedPairBondRels = stagedPairBondRels.map((stagedPairBondRel) => {
      return ( <StagedPairBondRelSearchLineItem stagedPairBondRel={stagedPairBondRel} key={stagedPairBondRel._id}/> )
    });

    return (
      <div class='mainDiv'>
        <div class='header-div'>
          <h1 class='family-header'></h1>
        </div>
        <div class='staged-container'>
          <div class='staged-header-container'>
          <div class="staged-person-one">
            <p>Person One</p>
          </div>
          <div class="staged-person-two">
            <p>Person Two</p>
          </div>
          <div class="staged-start-date">
            <p>Start Date</p>
          </div>
          <div class="staged-pairbond-list">
            {mappedStagedPairBondRels}
          </div>
        </div>
      </div>
    </div>
    )
  }
}
