import React from 'react';
import { connect } from 'react-redux';

import MatchedPeopleDetails from './matched-peopledetails';
import StagedPeopleDetailsLineItem from './staged-peopledetails-lineitem';

@connect(
  (store, ownProps) => {
    var stagedStar = store.stagedPeople.stagedPeople.find(function(p) {
      return p._id === ownProps.params._id;
    });
    return {
      stagedStar:
        stagedStar,
      // get all people existing in the FG DB that match our stagedStar
      starMatches:
        store.people.people.filter(function(m) {
          return ((m.fName === stagedStar.fName || m.lName === stagedStar.lName) && m.sexAtBirth === stagedStar.sexAtBirth)
        })
    };
  },
)

export default class StagedPeopleDetails extends React.Component {
  render = () => {

    const { stagedStar, starMatches } = this.props;

    const mappedMatches = starMatches.map(starMatch =>
      <MatchedPeopleDetails person={starMatch} key={starMatch._id} starId={stagedStar._id}/>
    );

    return (<div>
      <div class="container">
        <div class="col-xs-12">
          <h1> Person Comparison </h1>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-2 title bold can-click">
        </div>
        <div class="col-xs-2 title bold can-click">
        </div>
        <div class="col-xs-1 title bold can-click">
          Gender
        </div>
        <div class="col-xs-2 title bold can-click">
          Birth Date
        </div>
        <div class="col-xs-2 title bold can-click">
          Death Date
        </div>
      </div>
      <div>
        <StagedPeopleDetailsLineItem person={stagedStar} />
      </div>
      <div class="container col-xs-12">
        <div class="row">
          <h1> Matching People in Your Database </h1>
        </div>
        <div>
          {mappedMatches}
        </div>
      </div>
    </div>

    )

  }
}
