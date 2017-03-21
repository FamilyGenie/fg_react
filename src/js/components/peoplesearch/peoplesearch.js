import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Modal from 'react-modal';
import AlertContainer from 'react-alert';
import { createPerson } from '../../actions/peopleActions';
import moment from 'moment';
import SearchInput, {createFilter} from 'react-search-input';

import PeopleSearchLineItem from './peoplesearch-lineitem';
// this next line is for the new person modal
import NewPerson from '../newperson/newperson';
import { openNewPersonModal } from '../../actions/modalActions';
import { updateHelpMessage } from '../../actions/helpMessageActions';

@connect((store, ownProps) => {
  return {
    user: store.user.user,
    userFetched: store.user.fetched,
    people: store.people.people.map((person) => {
      var bDate = store.events.events.find((e) => {
        return (person._id === e.person_id && e.eventType.toLowerCase() === "birth");
      })
      if (bDate) {
        person.eventDate = bDate.eventDate;
        person.eventDateUser = (bDate.eventDateUser ? bDate.eventDateUser: (bDate.eventDate ? bDate.eventDate.substr(0,10): ""));
      }
      return person
    }),
    modalIsOpen: store.modal.newPerson.modalIsOpen,
    KEYS_TO_FILTERS:['fName', 'lName', 'mName', 'eventDateUser', 'eventDate'],
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
  constructor (props) {
    super(props);

    this.props.updateHelpMessage('This is the family search page');

    this.state = {
      reverse: false,
      searchTerm: "",
      mappedPeople: this.props.people.filter(createFilter("", this.props.KEYS_TO_FILTERS)).map((person) => {
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
        sortedPeople = this.props.people.sort(function(a, b) {
          if (a.lName != undefined && b.lName != undefined) {
            if (b.lName != a.lName) {
              return b.lName.localeCompare(a.lName);
            }
          }
          else {
            return b.lName - a.lName;
          }
        });
      }
      else if (sortType === 'date') {
        sortedPeople = this.props.people.sort(function(a, b) {
          if (a.eventDate && b.eventDate ) {
            return moment(b.eventDate.substr(0,10), 'YYYY-MM-DD') - moment(a.eventDate.substr(0,10), 'YYYY-MM-DD');
          }
          else {
            return b.eventDate - a.eventDate;
          }
        });
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
          if (b.eventDate && a.eventDate ) {
            return moment(a.eventDate.substr(0,10), 'YYYY-MM-DD') - moment(b.eventDate.substr(0,10), 'YYYY-MM-DD');
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
  searchUpdate = (term) => {
    const mappedPeople = this.props.people.filter(createFilter(term, this.props.KEYS_TO_FILTERS)).map((person) => {
      return <PeopleSearchLineItem person={person} key={person._id}/>
    });

    this.setState({
      searchTerm: term,
      mappedPeople: mappedPeople,
    });
  }

  // if we ever figure out how to clear the search input field, this is the function we would use to reset the family list

  // clearSearch = () => {
  //   this.setState({
  //     searchTerm: "",
  //     mappedPeople: this.props.people.filter(createFilter("", this.props.KEYS_TO_FILTERS)).map((person) => {
  //       return <PeopleSearchLineItem person={person} key={person._id}/>
  //     }),
  //   });
  //   this.refs.searchBox = "";
  // }

	render = () => {
    const { people, modalIsOpen } = this.props;
    const { reverse, mappedPeople } = this.state;

    // TODO: I believe this is creating a warning in the browser about not altering the state in the render function. Where else can this go?
    const filteredPeople = people.filter(createFilter(this.state.searchTerm, this.props.KEYS_TO_FILTERS));

    return (
      <div class="mainDiv">
    		<div class="header-div">
          <h1 class="family-header">Family List</h1>
        </div>
        <div id="family-content">
          <div id="family">
            <div id="add-family" onClick={this.createNewPerson}>
                <p class="add">Add Family Members</p>
                <i class="fa fa-plus-square plus" id="create-person" aria-hidden="true">
                </i>
            </div>
            <div id="buffer-div">
            </div>
            <div class="familySortDiv">
              <div class="family-header-container">
                <div class="familyHeader1">
                  <span class="familySort">Sort:</span>
                </div>
                <div class="familyHeader2">
                  <span onClick={() => this.sortPeople('fName')} class="familySort">First Name</span>
                </div>
                <div class="familyHeader2">
                  <span onClick={() => this.sortPeople('lName')} class="familySort">Last Name</span>
                </div>
                <div class="familyHeader2">
                  {/*using the arrow function in the onClick allows for passing in parameters, in the case of reverseSort, it prevents it from being called during the render method.*/}
                  <span onClick={() => this.sortPeople('date')} class="familySort"> Date </span>
                </div>
                <SearchInput
                  class="searchPeople"
                  type="text"
                  value={this.state.seachTerm}
                  ref="searchBox"
                  placeholder=""
                  onChange={this.searchUpdate}
                />
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
      </div>
    );
  }

  componentDidUpdate = (prevProps, prevState) => {
    // this will make the window scroll to the top when you open this page
    ReactDOM.findDOMNode(this).scrollIntoView();

    // when the props change is when we have data to show, so execute the sort at this time.
    if (prevProps !== this.props) {
      this.sortPeople('date');
    }
  }
}
