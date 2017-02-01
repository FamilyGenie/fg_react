import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import ChronologyLineItem from './chronology-lineitem';

@connect((store, ownProps) => {
  console.log('in chronology@connect with: ', store, ownProps)
  return {
    /*
     * events: store.events.events.filter(function(e) {
     *   return e.user_id === store.user.user.id;
     * }),
     */
    events: store.events.events,
  }
})
export default class Chronology extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      reverse: false,
    };
  }

  reverseSort = () => {
    if (this.state.reverse === false) {
      this.setState({reverse : true});
    }
    else {
      this.setState({reverse : false});
    }
  }

  sortEvents = (eventsArr, reverse, sortType) => {
    sortType = sortType || '';
    var sortedEvents;
    if (reverse) {
      if (sortType === 'date') {
        sortedEvents = eventsArr.sort(function(a, b) {
          console.log('in date1')
          return moment(b.eventDate).unix() - moment(a.eventDate).unix();
        });
      }
      else if (sortType === 'type') {
        console.log('in sort type')
        sortedEvents = eventsArr.sort(function(a, b) {
          return b.eventType - a.eventType;
        })
      }
      else if (sortType === 'place') {
        console.log('in sort place')
        sortedEvents = eventsArr.sort(function(a, b) {
          return b.eventType - a.eventType;
        })
      }
      else {
        sortedEvents = eventsArr.sort(function(a, b) {
          console.log('in default')
          return moment(a.eventDate).unix() - moment(b.eventDate).unix();
        });
      }
    }
    else {
        if (sortType === 'date') {
          sortedEvents = eventsArr.sort(function(a, b) {
            console.log('in date2')
            return moment(a.eventDate).unix() - moment(b.eventDate).unix();
          });
        }
        else if (sortType === 'type') {
        console.log('in sort type')
          sortedEvents = eventsArr.sort(function(a, b) {
            return a.eventType - b.eventType;
          })
        }
        else if (sortType === 'place') {
        console.log('in sort place')
          sortedEvents = eventsArr.sort(function(a, b) {
            return a.eventType - b.eventType;
          })
        }
        else {  
            console.log('in default 2')
          sortedEvents = eventsArr.sort(function(a, b) {
            return moment(a.eventDate).unix() - moment(b.eventDate).unix();
          });
        }
      }

    var mappedEvents = sortedEvents.map(event => 
      <ChronologyLineItem event={event} eventId={event._id} key={event._id}/>
    );
    console.log(mappedEvents)

    return mappedEvents
  }

  render = () => { 

    const { events } = this.props;
    const { reverse }  = this.state;

    var mappedEvents = this.sortEvents(events, reverse)
    
    if(events) {
      return(<div>
        <div style={{height : 75 + 'px'}}></div>
        <h2> Chronology </h2>

        <div class="container">
          <div class="col-xs-1"></div>
          {/*using the arrow function in the onClick allows for passing in parameters, in the case of reverseSort, it prevents it from being called during the render method.*/} 
          <div class="col-xs-2"><span onClick={() => this.sortEvents(events, reverse, 'date')}> Date </span><span onClick={() => this.reverseSort()}>***</span></div>
          <div class="col-xs-3"> Person <span onClick={() => this.reverseSort()}>***</span></div>
          <div class="col-xs-2"><span onClick={() => this.sortEvents(events, reverse, 'type')}> Type </span><span onClick={() => this.reverseSort()}>***</span></div>
          <div class="col-xs-2"> Place <span onClick={() => this.reverseSort()}>***</span></div>
          {mappedEvents}
        </div>
        
      </div>)
    } else {
      return (<p>Loading...</p>)
    }
  
  }
}
