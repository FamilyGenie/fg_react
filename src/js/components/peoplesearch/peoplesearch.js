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
    people: store.people.people.map((person) => {
      console.log("in the props", person);
      var event = store.events.events.find((e) => {
        console.log(e);
        return (person._id === e.person_id && e.eventType === "Birth");
      })
      if (event) {
        person.birthDate === event.eventDate;
      }
      return person;
    }),
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
  constructor (props) {
    super(props);
    this.state = {
      reverse: false,
      mappedPeople: this.props.people.map((person) => {
        return <PeopleSearchLineItem person={person} key={person._id}/>
      }),
    };
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
  sortPeople = (sortType) => {
    console.log("at the top", this.props.people, sortType);
    this.setState({reverse: !this.state.reverse})
    sortType = sortType || '';
    var sortedPeople;
    if (this.state.reverse) {
      if (sortType === 'fName') {
        sortedPeople = this.props.people.sort(function(a, b) {
          if (a.fName != undefined && b.fName != undefined) {
            if (b.fName != a.fName) {
              return b.fName.localeCompare(a.fName);
            }
          }
          else {
            return b.fName - a.fName;
          }
        })
      }
      else if (sortType === 'lName') {
        sortedPeople = this.props.people.sort (function(a, b) {
          if (a.lName != undefined && b.lName != undefined) {
            if (b.lName != a.lName) {
              return b.lName.localeCompare(a.lName);
            }
          }
          else {
            return b.lName - a.lName;
          }
        })
      }
      else if (sortType === 'date') {
        sortedPeople = this.props.people.sort (function(a, b) {
          if (a.birthDate && b.birthDate ) {
            return moment(a.eventDate.substr(0,10), 'YYYY-MM-DD') - moment(b.eventDate.substr(0,10), 'YYYY-MM-DD');
          }
          else {
            return b.eventDate - a.eventDate;
          }
        })
      }
    }
    else {
      if (sortType === 'fName') {
        sortedPeople = this.props.people.sort(function(a, b) {
          if (b.fName != undefined && a.fName != undefined) {
            if (a.fName != b.fName) {
              return a.fName.localeCompare(b.fName);
            }
          }
          else {
            return a.fName - b.fName;
          }
        })
      }
      if (sortType === 'lName') {
        sortedPeople = this.props.people.sort (function(a, b) {
          if (b.lName != undefined && a.lName != undefined) {
            if (a.lName != b.lName) {
              return a.lName.localeCompare(b.lName);
            }
          }
          else {
            return a.lName - b.lName;
          }
        })
      }
      else if (sortType === 'date') {
        sortedPeople = this.props.people.sort (function(a, b) {
          if (b.birthDate && a.birthDate ) {
            return moment(b.eventDate.substr(0,10), 'YYYY-MM-DD') - moment(a.eventDate.substr(0,10), 'YYYY-MM-DD');
          }
          else {
            return a.eventDate - b.eventDate;
          }
        })
      }
    }

    var mappedPeople = sortedPeople.map(person =>
      <PeopleSearchLineItem person={person} key={person._id}/>
    );
    this.setState({mappedPeople: mappedPeople});
    return mappedPeople;
  }
	render = () => {
    const { people, modalIsOpen } = this.props;
    const { reverse, mappedPeople } = this.state;

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
                  <span onClick={() => this.sortPeople('fName')} class="familySort">First Name</span>
                </div>
                <div class="familyHeader1">
                  <span onClick={() => this.sortPeople('lName')} class="familySort">Last Name</span>
                </div>
                <div class="familyHeader2">
                  {/*using the arrow function in the onClick allows for passing in parameters, in the case of reverseSort, it prevents it from being called during the render method.*/}
                  <span onClick={() => this.sortPeople('date')} class="familySort"> Date </span>
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
