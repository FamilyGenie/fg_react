import React from 'react';
import { connect } from 'react-redux';

import MatchedPeopleDetails from './matched-peopledetails';
import StagedPeopleDetailsLineItem from './staged-peopledetails-lineitem';

@connect(
  (store, ownProps) => {
    const stagedStar = store.stagedPeople.stagedPeople.find(function(p) {
      return p._id === ownProps.params._id;
    });
    return {
      stagedStar:
        stagedStar,
      // get all people existing in the FG DB that match our stagedStar
      starMatches:
        store.people.people.filter(function(m) {
          let fName, mName;
          if (stagedStar.fName.indexOf(' ') >= 0) {
            fName = stagedStar.fName.split(' ')[0];
            mName = stagedStar.fName.split(' ')[1];
          }
          return ((((m.fName === fName || m.mName === mName) && m.lName === stagedStar.lName) && m.sexAtBirth === stagedStar.sexAtBirth) || m.birthDate === stagedStar.birthDate)
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

    return (
      <div class="mainDiv">
        <div class="header-div">
          <h1 class="family-header"> Person Comparison </h1>
        </div>
        <div class="comparisonDiv">
          <div class="stagedComparison">
            <div class="stagedHeader1">
              <h3 class="stagedH3"> Potential Import </h3>
            </div>
            <div class='staged-header-container'>
              <div class="comparisonNameDiv">
                <p>Name</p>
              </div>
              <div class="staged-sex">
                <p>Sex</p>
              </div>
              <div class="stagedHDob">
                <p>Date of Birth</p>
              </div>
            </div>
            <div class="comparisonList">
              <StagedPeopleDetailsLineItem person={stagedStar} />
            </div>
          </div>
          <div class="mappedMatches">
            <div class="stagedHeader1">
              <h3 class="stagedH3"> Matches In Your System </h3>
            </div>
            {mappedMatches}
          </div>
        </div>
      </div>
    )
  }
}
