import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import ChronologyLineItem from './chronology-lineitem';

@connect((store, ownProps) => {
  return {
    events: store.events.events,
  }
})
export default class Chronology extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      reverse: false,
      mappedEvents: []
    };
  }

  componentDidMount = () => {
    this.sortEvents('date');
  }

  sortEvents = (sortType) => {
    this.setState({reverse : !this.state.reverse})
    sortType = sortType || '';
    var sortedEvents;
    if (this.state.reverse) {
      if (sortType === 'date') {
        sortedEvents = this.props.events.sort(function(a, b) {
          return moment(b.eventDate.substr(0,10), 'YYYY-MM-DD') - moment(a.eventDate.substr(0,10), 'YYYY-MM-DD');
        });
      }
      else if (sortType === 'type') {
        sortedEvents = this.props.events.sort(function(a, b) {
          return (b.eventType > a.eventType ? 1 : -1);
        })
      }
      /*
       * else if (sortType === 'place') {
       *   sortedEvents = this.props.events.sort(function(a, b) {
       *     return b.eventType - a.eventType;
       *   })
       * }
       * else {
       *   sortedEvents = this.props.events.sort(function(a, b) {
       *     return moment(a.eventDate) - moment(b.eventDate);
       *   });
       * }
       */
    }
    else {
        if (sortType === 'date') {
          sortedEvents = this.props.events.sort(function(a, b) {
            return moment(a.eventDate.substr(0,10), 'YYYY-MM-DD') - moment(b.eventDate.substr(0,10), 'YYYY-MM-DD');
          });
        }
        else if (sortType === 'type') {
          sortedEvents = this.props.events.sort(function(a, b) {
          return (b.eventType < a.eventType ? 1 : -1);
          })
        }
        /*
         * else if (sortType === 'place') {
         *   sortedEvents = this.props.events.sort(function(a, b) {
         *     return a.eventType - b.eventType;
         *   })
         * }
         * else {  
         *   sortedEvents = this.props.events.sort(function(a, b) {
         *     return moment(a.eventDate) - moment(b.eventDate);
         *   });
         * }
         */
      }

    var mappedEvents = sortedEvents.map(event => 
      <ChronologyLineItem event={event} eventId={event._id} key={event._id}/>
    );
    this.setState({mappedEvents: mappedEvents});
    return mappedEvents
  }

  

  render = () => { 
    const { events } = this.props;
    const { reverse }  = this.state;

    
    if(events) {
      return(<div>
        <div style={{height : 75 + 'px'}}></div>
        <h2> Chronology </h2>

        <div class="container">
          <div class="col-xs-1"></div>
          {/*using the arrow function in the onClick allows for passing in parameters, in the case of reverseSort, it prevents it from being called during the render method.*/} 
          <div class="col-xs-2"><span onClick={() => this.sortEvents('date')}> Date </span></div>
          <div class="col-xs-3"> Person </div>
          <div class="col-xs-2"><span onClick={() => this.sortEvents('type')}> Type </span></div>
          <div class="col-xs-2"> Place </div>
          {this.state.mappedEvents}
        </div>
        
      </div>)
    } else {
      return (<p>Loading...</p>)
    }
  
  }
}
