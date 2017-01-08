import React from 'react';
import { connect } from 'react-redux';

import { updatePerson } from '../../actions/peopleActions';

@connect(
  (store, ownProps) => {

    for (event in store.events.events) {
      if (event.person_id === ownProps.person._id) {

      }
    }
    return {
      person: ownProps.person,
      events: store.events,
      people: store.people
    };
  },
  (dispatch) => {
    return {
      onBlur: (_id, field, value) => {
        dispatch(updatePerson(_id, field, value));
      },
    }
  }
)

export default class MatchedPeopleDetailsLineItem extends React.Component {

  getOnBlur = (field) => {
    return (evt) => {
      this.props.onBlur(this.props.person._id, field, evt.target.value);
    }
  }

  render = () => {
    const { person, events, onBlur } = this.props;

    if (person) {
      return(
        <div class="row person-item">
          <div class="col-xs-2 custom-input">
            <input
              class="form-control"
              type="text"
              defaultValue={person.fName}
              onBlur={this.getOnBlur('fName')}
            />
          </div>

          <div class="col-xs-2 custom-input">
            <input
              class="form-control"
              type="text"
              defaultValue={person.mName}
              onBlur={this.getOnBlur('mName')}
            />
          </div>

          <div class="col-xs-2 custom-input">
            <input
              class="form-control"
              type="text"
              defaultValue={person.lName}
              onBlur={this.getOnBlur('lName')}
            />
          </div>

          <div class="col-xs-1 custom-input">
            <input
              class="form-control"
              type="text"
              defaultValue={person.sexAtBirth}
              onBlur={this.getOnBlur('sexAtBirth')}
            />
          </div>
          <div class="col-xs-3 custom-input">
            <button
              class="form-control"
            >
              Use This Person
            </button>
          </div>
        </div>
      );
    } else {
      return (<p>Loading...</p>);
    }
  }
}
