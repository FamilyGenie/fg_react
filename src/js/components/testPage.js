import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import { newPerson } from '../actions/newPersonActions';

@connect(
  (store, ownProps) => {
    return {
      people: store.people.people,
      store, 
      ownProps,
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

export default class TestNewPerson extends React.Component {

  createNewPerson = () => {
    this.props.newPerson();

    hashHistory.push('/peopledetails/' + this.props.people[this.props.people.length - 1]._id)
  }


  render = () => {

  const { people, store, ownProps } = this.props

    return (<div>

      <button onClick={this.createNewPerson}> New Person </button>

    </div>);

  }
}
