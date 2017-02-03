import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Modal from 'react-modal';
import AlertContainer from 'react-alert';
import { createPerson } from '../../actions/peopleActions';

import PeopleSearchLineItem from './peoplesearch-lineitem';
import NewPerson from '../newperson';
import { newPerson } from '../../actions/createNewPersonActions';
import { closeNewPersonModal } from '../../actions/modalActions';
import HistoryBar from '../historybar/historybar';

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
    createNewPerson: () => {
      dispatch(newPerson());
    },
  }
}
)
export default class PeopleSearch extends React.Component {
  constructor(props){
    super(props);
  }

  alertOptions = {
      offset: 15,
      position: 'middle',
      theme: 'light',
      time: 0,
      transition: 'scale'
    };

  createNewPerson = () => {
    this.props.createNewPerson();
  }
  // selectedStyle = () => {
  //   if (this.state.hiddenHistory) {
  //     var mainStyle = {
  //       display: flex;
  //       flex-direction: column;
  //       background-color: #E9EBEE;
  //       z-index: 0;
  //       position: relative;
  //       min-height: 100vh;
  //       margin-right: 300px;
  //     }
  //   }
  //   else {
  //     var mainStyle = {
  //       display: flex;
  //       flex-direction: column;
  //       background-color: #E9EBEE;
  //       z-index: 0;
  //       position: relative;
  //       min-height: 100vh;
  //       margin-right: 0px;
  //     }
  //   }
  //
  // }

	render = () => {
    const { people, modalIsOpen } = this.props;

    const mappedPeople = people.map(person =>
        <PeopleSearchLineItem person={person} key={person._id}/>
    );


    var modalStyle = {
      overlay: {
      position: 'fixed',
      top: 50,
      left: 50,
      width: '90vw',
      height: '80vh',
      // right: 100,
      // bottom: 100,
      }
    };

        return (
      <div class="main" style={this.selectedStyle}>
    		<div class="header-div">
          <h1 class="family-header">Family List</h1>
        </div>
        <HistoryBar/>
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
          	{mappedPeople}
          </div>
        </div>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Modal"
        style={modalStyle}
      >
        <NewPerson/>
      </Modal>
      <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
        <div id="below-family">
        </div>
      </div>);
    }
}
