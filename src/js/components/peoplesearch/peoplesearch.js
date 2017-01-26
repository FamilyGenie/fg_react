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
          <h1 class="family-header">Family List</h1>
        </div>
        <div id="family-content">
          <div id="family">
            <div id="add-family">
              <div class="blank-person-header">
  						</div>
      				<p class="add">
      					Add Family Members
      				</p>
              <div class="search-add">
                <i class="fa fa-plus-square" id="create-person" aria-hidden="true" onClick={this.createPerson}>
                </i>
              </div>
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
