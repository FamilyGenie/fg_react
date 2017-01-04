import React from 'react';
import { connect } from 'react-redux';

import StagedPeopleSearchLineItem from './staged-peoplesearch-lineitem';

@connect(
  (store, ownProps) => {
    console.log("in staged-peoplesearch@connect with: ", store);
    return {
      user: store.user.user,
      userFetched: store.user.fetched,
      stagedPeople: store.stagedPeople.stagedPeople,
    };
})

export default class StagedPeopleSearch extends React.Component {
  render = () => {
    const { stagedPeople } = this.props;

    const mappedStagedPeople = stagedPeople.map(stagedPerson =>
      <StagedPeopleSearchLineItem stagedPerson={stagedPerson} key={stagedPerson._id}/>
    );
    console.log(this.props)

    return (<div>
    <div class='container'>
      <h1> Family Members </h1>
    </div>
    <div>
      <div class='row'>
        <div class='col-xs-2 title bold can-click'>
          First Name
        </div>
        <div class='col-xs-2 title bold can-click'>
          Last Name
        </div>
        <div class="col-xs-2 title bold can-click">
          Date of Birth
        </div>
    </div>
    </div>
      <div>
        {mappedStagedPeople}
      </div>
    </div>);
  }
}
