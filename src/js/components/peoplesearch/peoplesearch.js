import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import PeopleSearchLineItem from './peoplesearch-lineitem';
import { newPerson } from '../../actions/newPersonActions';

@connect((store) => {
  return {
    user: store.user.user,
    userFetched: store.user.fetched,
    people: store.people.people,
  };
},
(dispatch) => {
  return {
    newPerson: () => {
      dispatch(newPerson());
    },
  }
}
)
export default class PeopleSearch extends React.Component {

  createNewPerson = () => {
    this.props.newPerson();

    hashHistory.push('/peopledetails/' + this.props.people[this.props.people.length - 1]._id)
  }

	render = () => {
        const { people } = this.props;

        const mappedPeople = people.map(person =>
            <PeopleSearchLineItem person={person} key={person._id}/>
        );

        return (
      <div id="outer-search">
    		<div class="header-div">
          <h1 class="h1">Family Members</h1>
        </div>
        <div id="family-content">
          <div id="people-info">
          </div>
          <div id="family">
            <div id="add-family">
              <div class="add-button">
        				<button
          					class="form-control add btn-info btn"
        					onClick={this.createNewPerson}>
        					Add Family Member
        				</button>
        			</div>
            </div>
            <div id="buffer-div">
            </div>
          	{mappedPeople}
          </div>
        </div>
      </div>);
    }
}
