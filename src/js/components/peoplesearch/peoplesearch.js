import React from 'react';
import { connect } from "react-redux"

import PeopleSearchLineItem from './peoplesearch-lineitem';

@connect((store) => {
  return {
    user: store.user.user,
    userFetched: store.user.fetched,
    people: store.people.people,
  };
})
export default class PeopleSearch extends React.Component {
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
        					onClick={this.openDetails}>
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
