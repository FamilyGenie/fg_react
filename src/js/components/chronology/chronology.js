import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import ChronologyLineItem from './chronology-lineitem';
// import { maternalRelPath, paternalRelPath, getAndColorEvents  } from '../../functions/common';

@connect((store, ownProps) => {
  return {
    events: store.events.events.map((event) => {
      var person = store.people.people.find((p) => {
        return event.person_id === p._id;
      })
      if (person) {
        event.personFName = person.fName;
        event.personLName = person.lName;
      }
      return event
    }),
    people: store.people.people,
    parentalRels: store.parentalRels.parentalRels,
  }
})
export default class Chronology extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      reverse: false,
      // initialize with unsorted events
      mappedEvents: this.props.events.map(event =>
        <ChronologyLineItem event={event} color={event.color} eventId={event._id} colorFuncs={this.colorFuncs} key={event._id}/>
      ),
    };
    console.log('state has been set')
  }


  sortEvents = (sortType) => {
    sortType = sortType || '';
    var sortedEvents;
    if (this.state.reverse) {
      if (sortType === 'date') {
        sortedEvents = this.props.events.sort(function(a, b) {
          // if there are values for both b.eventDate and a.eventDate
          if (b.eventDate && a.eventDate) {
            // must call moment here to sort. Take the substr and format to handle moments auto-detect deprecation issue
            return moment(b.eventDate.substr(0,10), 'YYYY-MM-DD') - moment(a.eventDate.substr(0,10), 'YYYY-MM-DD');
          }
          // if there are no values for either, it doesn't matter if we return a positive or negative number
          else if (!b.eventDate && !a.eventDate) {
            return 1
          }
          // only get here if there is not a b value and not there is an a value
          else if (!b.eventDate) {
            return 1
          }
          // only get here if there is not an a value and there is a b value
          else {
            return -1
          }
        });
      }
      else if (sortType === 'type') {
        sortedEvents = this.props.events.sort(function(a, b) {
          return (b.eventType > a.eventType ? 1 : -1);
        })
      }
      else if (sortType === 'place') {
        sortedEvents = this.props.events.sort(function(a, b) {
          // Using localeCompare (ES6 function) to compare strings.
          if (b.eventPlace != undefined && a.eventPlace != undefined) {
            return b.eventPlace.localeCompare(a.eventPlace);
          }
          else {
            return b.eventPlace - a.eventPlace
          }
        })
      }
      else if (sortType === 'person') {
        sortedEvents = this.props.events.sort(function(a, b) {
          if (a.personLName != undefined && b.personLName != undefined) {
          // Using localeCompare (ES6 function) to compare strings.
            if (b.personLName !== a.personLName) {
              return b.personLName.localeCompare(a.personLName);
            }
            else {
              return b.personFName.localeCompare(a.personFName);
            }
          }
          else {
            return b.personLName - a.personLName;
          }
        })
      }
      else {
        sortedEvents = this.props.events.sort(function(a, b) {
          return moment(a.eventDate) - moment(b.eventDate);
        });
      }
    }
    else {
      if (sortType === 'date') {
        sortedEvents = this.props.events.sort(function(a, b) {
          // if there are values for both b.eventDate and a.eventDate
          if (b.eventDate && a.eventDate) {
            // must call moment here to sort. Take the substr and format to handle moments auto-detect deprecation issue
            return moment(a.eventDate.substr(0,10), 'YYYY-MM-DD') - moment(b.eventDate.substr(0,10), 'YYYY-MM-DD');
          }
          // if there are no values for either, it doesn't matter if we return a positive or negative number
          else if (!b.eventDate && !a.eventDate) {
            return 1
          }
          // only get here if there is not a b value and not there is an a value
          else if (!b.eventDate) {
            return -1
          }
          // only get here if there is not an a value and there is a b value
          else {
            return 1
          }
        });
        // sortedEvents = this.props.events.sort(function(a, b) {
        //   // must call moment here to sort. Take the substr and format to handle moments auto-detect deprecation issue
        //   if (b.eventDate && a.eventDate) {
        //     return moment(a.eventDate.substr(0,10), 'YYYY-MM-DD') - moment(b.eventDate.substr(0,10), 'YYYY-MM-DD');
        //   }
        //   else {
        //     return a.eventDate - b.eventDate;
        //   }
        // });
      }
      else if (sortType === 'type') {
        sortedEvents = this.props.events.sort(function(a, b) {
          return (b.eventType < a.eventType ? 1 : -1);
        })
      }
      else if (sortType === 'place') {
        sortedEvents = this.props.events.sort(function(a, b) {
          // Using localeCompare (ES6 function) to compare strings.
          if (a.eventPlace != undefined && b.eventPlace != undefined) {
            return a.eventPlace.localeCompare(b.eventPlace);
          }
          else {
            return a.eventPlace - b.eventPlace;
          }
        })
      }
      else if (sortType === 'person') {
        sortedEvents = this.props.events.sort(function(a, b) {
          if (a.personLName != undefined && b.personLName != undefined) {
          // Using localeCompare (ES6 function) to compare strings.
            if (a.personLName !== b.personLName) {
              return a.personLName.localeCompare(b.personLName);
            }
            else {
              return a.personFName.localeCompare(b.personFName);
            }
          }
          else {
            return a.personLName - b.personLName;
          }
        })
      }
      else {
        sortedEvents = this.props.events.sort(function(a, b) {
          return moment(a.eventDate) - moment(b.eventDate);
        });
      }
    }

    var mappedEvents = sortedEvents.map(event =>
      <ChronologyLineItem event={event} color={event.color} eventId={event._id} colorFuncs={this.colorFuncs} key={event._id}/>
    );
    this.setState({mappedEvents: mappedEvents, reverse : !this.state.reverse});
    return mappedEvents
  }

  render = () => {
    const { events, people } = this.props;
    const { reverse, mappedEvents }  = this.state;


    if(events) {
      return(
      <div class="mainDiv">
        <div class="header-div">
          <h1 class="family-header"> Chronology </h1>
        </div>
        <div class="staged-container">
          <div class='staged-header-container'>
            <div class="chronHeader1" id="firstChronHeader">
              {/*using the arrow function in the onClick allows for passing in parameters, in the case of reverseSort, it prevents it from being called during the render method.*/}
              <span onClick={() => this.sortEvents('date')} class="chronHeaderText"> Date </span>
            </div>
            <div class="chronHeader2">
              <span onClick={() => this.sortEvents('person')} class="chronHeaderText2">Person</span>
            </div>
            <div class="chronHeader3">
              <span onClick={() => this.sortEvents('type')} class="chronHeaderDate">Type</span>
            </div>
            <div class="chronHeader4">
              <p><span onClick={() => this.sortEvents('place')} class="chronHeaderDate"> Place </span></p>
            </div>
            <div class="stagedHeaderReview">
              <p>Edit</p>
            </div>
          </div>
        <div class="staged-people-list">
          {this.state.mappedEvents}
        </div>
      </div>
    </div>
    )
    } else {
      return (<p>Loading...</p>)
    }

  }

  componentDidUpdate = (prevProps, prevState) => {
    // this will make the window scroll to the top when you open this page
    ReactDOM.findDOMNode(this).scrollIntoView();

    // when the props change is when we have data to show, so execute the sort at this time.
    if (prevProps !== this.props) {
      this.sortEvents('date');
    }
  }

  /***************************************************************/
  // The code below here is currently not in use. Might use when we start color-coding events in the chronology window
  // This function returns mom, mom's mom, mom's mom's mom, etc...
  /*
  maternalEvents = (starId) => {
    // get all _id of maternal relations
    let mRels = maternalRelPath(starId, this.props.people, this.props.parentalRels);
    // map the events and set the state to display the events
    for (let m in mRels) {
      getAndColorEvents(mRels[m], 'red', this.props.events);
    }
    let mappedEvents = this.props.events.map(event =>
      <ChronologyLineItem event={event} color={event.color} eventId={event._id} colorFuncs={this.colorFuncs} key={event._id}/>
    );
    this.setState({mappedEvents, reverse : !this.state.reverse});
    console.log('maternal');
    console.log(this.state)
  }

  // This function returns dad, dad's dad, dad's dad's dad, etc...
  paternalEvents = (starId) => {
    let pRels = paternalRelPath(starId, this.props.people, this.props.parentalRels);

    for (let p in pRels) {
      getAndColorEvents(pRels[p], 'blue', this.props.events);
    }
    let mappedEvents = this.props.events.map(event =>
      <ChronologyLineItem event={event} color={event.color} eventId={event._id} colorFuncs={this.colorFuncs} key={event._id}/>
    );
    this.setState({mappedEvents, reverse : !this.state.reverse});
    console.log('paternal');
  }
  colorEvents = (starId) => {
    this.maternalEvents(starId)
    this.paternalEvents(starId)
    console.log('all');
  }
  colorFuncs = {
    maternalEvents: this.maternalEvents,
    paternalEvents: this.paternalEvents,
    colorEvents: this.colorEvents
  };
  */
  /***************************************************************/

}
