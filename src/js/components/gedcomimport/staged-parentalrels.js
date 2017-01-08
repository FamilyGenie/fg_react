import React from 'react';
import { connect } from 'react-redux';

import { fetchParentalRels } from '../../actions/stagedParentalRelActions';
// import MatchedParentalRelLineItem from './matched-parentalrel-lineitem';
// import StagedParentalRelLineItem from './staged-parentalrel-lineitem';

@connect(
  (store, ownProps) => {
    console.log('in staged-parentalrel@connect with: ', store, ownProps);

    var stagedStar = store.stagedParentalRels.stagedParentalRels.find(function(c) {
      return c._id === ownProps.params._id;
    });

    var stagedParents = store.stagedParentalRels.stagedParentalRels.filter(function(p) {
      return p._id === ownProps.params.parent_id;
    });

    return {
      stagedStar:
        stagedStar,
      starMatches:
        store.parentalRels.parentalRels.filter(function(m) {
          return (m.child_id === stagedStar.child_id || m.parent_id === stagedStart.parent_id)
        }),
      stagedParents:
        stagedParents,
    };
  },
)

export default class StagedParentalRels extends React.Component {
  render = () => {

    const { stagedStar, starMatches } = this.props;

    /*
     * const mappedMatcheParents = starMatches.map(starMatch =>
     *   <MatchedParentalRelLineItem parent={starMatch} key={starMatch._id}/>
     * );
     */

    /*
     * const mappedStagedParents = stagedParents.map(stagedParent =>
     *   <StagedParentLineItem parent={stagedParent} key={stagedParent._id}/>
     * );
     */

    return (<div>
      <div class="container">
        <div class="col-xs-12">
          <h1> Parental Relationship Comparison </h1>
          <h3> Child </h3>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-4 title bold can-click">
          First Name
        </div>
        <div class="col-xs-4 title bold can-click">
          Last Name
        </div>
        <div class="col-xs-4 title bold can-click">
          Birth Date
        </div>
      </div>
      <div>
      <div class="col-xs-4">
        Edward
      </div>
      <div class="col-xs-4">
        Vetter-Drake
      </div>
      <div class="col-xs-4">
        1995-06-28
      </div>
      {/*
        <StagedChildLineItem child={stagedStar}/>
      */}
      </div>
      <div class="container">
        <div class="col-xs-12">
          <h3> Parents </h3>
        </div>
      </div>
      <div class="container col-xs-12">
        <div class="row">
          <div class="col-xs-6 title bold can-click">
            Staged Parents
          </div>
          <div class="col-xs-2 title bold can-click">
            Matched Parents
          </div>
        </div>
        <div class="col-xs-6">
        Staged Parents
      {/*
          {mappedMatchedParents}
      */}
        </div>
        <div class="col-xs-6">
        Matched Parents
      {/*
          {mappedStagedParents}
      */}
        </div>
      </div>
    </div>)
  }
}


