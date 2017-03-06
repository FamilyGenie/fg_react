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
      }
    }
  }
)
export default class PeopleSearch extends React.Component {

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
          <div class="familySearch">
            <h3 class="searchH">Search</h3>
            <div class="bufferSearch"></div>
            <div class="searchContent">
              <input
  							class="form-control searchInput"
  							type="text"
  							value={""}
  							placeholder="Enter First Name"
  						/>
              <input
                class="form-control searchInput"
                type="text"
                value={""}
                placeholder="Enter Last Name"
              />
              <input
                class="form-control searchInput"
                type="text"
                value={""}
                placeholder="Enter Date"
              />
            </div>
            <div class="bufferSearch"></div>
            <button class="btn btn-default btn-FL">Search</button>
          </div>
          <div class="staged-container">
            <div class="staged-header-container">
              <i class="fa fa-plus-square plus" id="create-person" aria-hidden="true" onClick={this.createNewPerson}>
              </i>
              <div class="familyHeader">
                <span onClick={() => this.sortEvents('person')}>Person</span>
              </div>
              <div class="familyHeader">
                {/*using the arrow function in the onClick allows for passing in parameters, in the case of reverseSort, it prevents it from being called during the render method.*/}
                <span onClick={() => this.sortEvents('date')}> Date </span>
              </div>

              <div class="stagedHeaderReview">
                <p>Review</p>
              </div>
            </div>
            <div class="staged-people-list">
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
