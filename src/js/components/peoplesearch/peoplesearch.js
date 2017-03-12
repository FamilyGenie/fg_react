import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Modal from 'react-modal';
import AlertContainer from 'react-alert';
import { createPerson } from '../../actions/peopleActions';

import PeopleSearchLineItem from './peoplesearch-lineitem';
// this next line is for the new person modal
import NewPerson from '../newperson/newperson';
import { openNewPersonModal } from '../../actions/modalActions';
import { updateHelpMessage } from '../../actions/helpMessageActions';

@connect((store, ownProps) => {
  return {
    user: store.user.user,
    userFetched: store.user.fetched,
    people: store.people.people,
    modalIsOpen: store.modal.newPerson.modalIsOpen,
    store,
  };
},
  (dispatch) => {
    return {
      openNewPersonModal: () => {
        dispatch(openNewPersonModal());
      },
      updateHelpMessage: (msg) => {
        dispatch(updateHelpMessage(msg));
      },
    }
  }
)
export default class PeopleSearch extends React.Component {
constructor(props) {
  super(props);
  this.props.updateHelpMessage('This is the family search page');
}
  alertOptions = {
      offset: 15,
      position: 'bottom left',
      theme: 'light',
      time: 0,
      transition: 'scale'
    };

  createNewPerson = () => {
    this.props.openNewPersonModal();
  }

	render = () => {
    const { people, modalIsOpen } = this.props;

    const mappedPeople = people.map(person =>
        <PeopleSearchLineItem person={person} key={person._id}/>
    );

        return (
      <div class="mainDiv">
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
                <i class="fa fa-plus-square plus" id="create-person" aria-hidden="true" onClick={this.createNewPerson}>
                </i>
              </div>
            </div>
            <div id="buffer-div">
            </div>
            <div class="mappedPeople">
          	{mappedPeople}
            </div>
          </div>
        </div>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Modal"
        className="detail-modal"
      >
        <NewPerson/>
      </Modal>
      <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
        <div id="below-family">
        </div>
      </div>);
    }
}
