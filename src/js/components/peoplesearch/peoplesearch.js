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
            <div class="searchButtons">
              <button class="btn btn-default btn-FL">Search</button>
              <button class="btn btn-default btn-FL">Cancel</button>
            </div>
          </div>
          <div id="family">
            <div id="add-family" onClick={this.createNewPerson}>
              <div class="search-add"></div>
                <p class="add">Add Family Members</p>
              <div class="search-add">
                <i class="fa fa-plus-square plus" id="create-person" aria-hidden="true">
                </i>
              </div>
            </div>
            <div id="buffer-div">
            </div>
            <div class="familySortDiv">
              <div class="staged-header-container">
                <div class="familyHeader1">
                  <span onClick={() => this.sortEvents('person')} class="familySort">Person</span>
                </div>
                <div class="familyHeader2">
                  {/*using the arrow function in the onClick allows for passing in parameters, in the case of reverseSort, it prevents it from being called during the render method.*/}
                  <span onClick={() => this.sortEvents('date')} class="familySort"> Date </span>
                </div>
                <div class="familyHeader3">
                  <p>Edit</p>
                  <p class="familyHeadText">Map</p>
                </div>
              </div>
              <div class="mappedPeople">
          	   {mappedPeople}
             </div>
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
