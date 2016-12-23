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

        return (<div>
    		<div class="container">
                <h1>Family Members</h1>
            </div>
            <div>
                <div class="row">
                    <div class="col-xs-2 title bold can-click">
                        First Name
                    </div>
                    <div class="col-xs-2 title bold can-click">
                        Middle Name
                    </div>
                    <div class="col-xs-2 title bold can-click">
                        Last Name
                    </div>
                </div>
            </div>
            <div>
            	{mappedPeople}
            </div>
        </div>);
    }
}
