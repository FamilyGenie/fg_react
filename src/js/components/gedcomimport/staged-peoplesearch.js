import React from 'react';
import { connect } from 'react-redux';

import StagedPeopleSearchLineItem from './staged-peoplesearch-lineitem';

@connect(
  (store, ownProps) => {
    return {
      user: store.user.user,
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

    return (<div>
    <div class='container'>
      <h1> Staged Family Members </h1>
    </div>
    <div>
      <div class='row'>
        <div class='col-xs-2 title bold can-click'>
          First Name
        </div>
        <div class='col-xs-2 title bold can-click'>
          Last Name
        </div>
        <div class="col-xs-1 title bold can-click">
          Sex At Birth
        </div>
        <div class="col-xs-2 title bold can-click">
          Date of Birth
        </div>
        <div class="col-xs-2 title bold can-click">
          Date of Death*
        </div>
    </div>
    </div>
      <div>
        {mappedStagedPeople}
      </div>
    </div>);
  }
}
