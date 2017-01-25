import React from 'react';
import { connect } from "react-redux"
import { createPerson } from '../../actions/peopleActions';

import PeopleSearchLineItem from './peoplesearch-lineitem';

@connect(
  (store) => {
    return {
      user: store.user.user,
      userFetched: store.user.fetched,
      people: store.people.people,
    };
  },
  (dispatch) => {
    return {
      createPerson: () => {
        dispatch(createPerson());
      }
    }
  }
)
export default class PeopleSearch extends React.Component {
  constructor (props) {
    super(props);
    console.log("in people search", this.props);
  }

  // When you create a new person record, it automatically creates the parentalRel records because we know every person came from a sperm and an egg (the biological father and mother). But we need to let the customer select who the bio father and bio mother are. 
  createPerson = () => {
    this.props.createPerson();
  };
	render = () => {
        const { people } = this.props;

        const mappedPeople = people.map(person =>
            <PeopleSearchLineItem person={person} key={person._id}/>
        );
        return (
      <div id="outer-search">
    		<div class="header-div">
          <h1 class="family-header">Family Members</h1>
        </div>
        <div id="search-instruction">
          <p>
          </p>
        </div>
        <div id="family-content">
          <div id="people-info">
          </div>
          <div id="family">
            <div id="add-family">
              <div class="blank-person-header">
  						</div>
      				<p class="add">
      					Family Members
      				</p>
              <i class="fa fa-plus-square" id="create-person" aria-hidden="true" onClick={this.createPerson}>
              </i>
            </div>
            <div id="buffer-div">
            </div>
          	{mappedPeople}
          </div>
        </div>
        <div id="below-family">
        </div>
      </div>);
    }
}
