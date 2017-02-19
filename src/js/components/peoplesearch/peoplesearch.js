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
  // constructor(props){
  //   super(props);
  //   this.state = {
  //     sidebarOpen: true,
  //   };
  // }
  // onSetSidebarOpen = (open) => {
  //   this.setState({sidebarOpen: open});
  // }
  //
  // // for the history bar showing or not
  // componentWillMount = () => {
  //   var mql = window.matchMedia('(min-width: 800px)');
  //   mql.addListener(this.mediaQueryChanged);
  //   this.setState({mql: mql, sidebarDocked: mql.matches});
  // }
  //
  // // for the history bar showing or not
  // componentWillUnmount = () => {
  //   this.state.mql.removeListener(this.mediaQueryChanged);
  // }
  // // for the history bar showing or not
  // mediaQueryChanged = () => {
  //   this.setState({sidebarDocked: this.state.mql.matches});
  // }

  alertOptions = {
      offset: 15,
      position: 'bottom left',
      theme: 'light',
      time: 0,
      transition: 'scale'
    };

  createNewPerson = () => {
    this.props.createNewPerson();
  }

	render = () => {
    const { people, modalIsOpen } = this.props;

    const mappedPeople = people.map(person =>
        <PeopleSearchLineItem person={person} key={person._id}/>
    );
    // const sidebarContent = <div><h1>Help</h1></div>;

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
