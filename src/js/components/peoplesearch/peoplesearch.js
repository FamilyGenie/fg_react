import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Modal from 'react-modal';
import AlertContainer from 'react-alert';
import { createPerson } from '../../actions/peopleActions';

import PeopleSearchLineItem from './peoplesearch-lineitem';
import NewPerson from '../newperson';
import { newPerson } from '../../actions/newPersonActions';
import { closeNewPersonModal } from '../../actions/modalActions';

@connect((store, ownProps) => {
  console.log('in peoplesearch@connect with: ', store, ownProps)
  return {
    user: store.user.user,
    userFetched: store.user.fetched,
    people: store.people.people,
    newPerson: store.people.people.find(function(p) {
      return p._id === store.modal.newPerson.id;
    }),
    newEvent: store.events.events.find(function(b) {
      return b.person_id === store.modal.newPerson.id;
    }),
    newParents: store.parentalRels.parentalRels.filter(function(p) {
      return p.child_id === store.modal.newPerson.id;
    }),
    modalIsOpen: store.modal.newPerson.modalIsOpen,
    store,
  };
},
(dispatch) => {
  return {
    createNewPerson: () => {
      dispatch(newPerson());
    },
    closeNewPersonModal: () => {
      dispatch(closeNewPersonModal());
    },
  }
}
)
export default class PeopleSearch extends React.Component {
  constructor(props){
    super(props);
    this.alertOptions = {
      offset: 15,
      position: 'middle',
      theme: 'light',
      time: 0,
      transition: 'scale'
    };
  }

  createNewPerson = () => {
    this.props.createNewPerson();
  }

  closeNewPersonModal = () => {
    // This is validation for the contents of the modal. The user must either delete the person or enter the required information.
    if (!this.props.newEvent.eventDate || !this.props.newEvent.eventDateUser) {
      msg.show('Need to enter a valid birth date', {
        type: 'error'
      });
    } else if (!this.props.newPerson.fName) {
      msg.show('Need to enter a valid first name', {
        type: 'error'
      })
    } else {
      this.props.closeNewPersonModal();
    }
  }

	render = () => {
    const { people, modalIsOpen } = this.props;

    const mappedPeople = people.map(person =>
        <PeopleSearchLineItem person={person} key={person._id}/>
    );


    var modalStyle = {
      overlay: {
      position: 'fixed',
      top: 100,
      left: 100,
      right: 100,
      bottom: 100,
      }
    };

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
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Modal"
        style={modalStyle}
      >
        <NewPerson/>
        <button onClick={this.closeNewPersonModal}> Close </button>
      </Modal>

      <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
        <div id="below-family">
        </div>
      </div>);
    }
}
