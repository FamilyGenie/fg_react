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
      mappedEvents: []
    };
  }

  sortEvents = (sortType) => {
    this.setState({reverse : !this.state.reverse})
    sortType = sortType || '';
    var sortedEvents;
    if (this.state.reverse) {
      if (sortType === 'date') {
        sortedEvents = this.props.events.sort(function(a, b) {
          console.log('in date acending')
          return moment(b.eventDate) - moment(a.eventDate);
        });
      }
      else if (sortType === 'type') {
        console.log('in sort type ascending')
        sortedEvents = this.props.events.sort(function(a, b) {
          return (b.eventType > a.eventType ? 1 : -1);
        })
      }
      /*
       * else if (sortType === 'place') {
       *   console.log('in sort place')
       *   sortedEvents = this.props.events.sort(function(a, b) {
       *     return b.eventType - a.eventType;
       *   })
       * }
       * else {
       *   sortedEvents = this.props.events.sort(function(a, b) {
       *     console.log('in default', a, b)
       *     return moment(a.eventDate) - moment(b.eventDate);
       *   });
       * }
       */
    }
    else {
        if (sortType === 'date') {
          sortedEvents = this.props.events.sort(function(a, b) {
            console.log('in date decending')
            return moment(a.eventDate) - moment(b.eventDate);
          });
        }
        else if (sortType === 'type') {
        console.log('in sort type descending')
          sortedEvents = this.props.events.sort(function(a, b) {
          return (b.eventType < a.eventType ? 1 : -1);
          })
        }
        /*
         * else if (sortType === 'place') {
         * console.log('in sort place')
         *   sortedEvents = this.props.events.sort(function(a, b) {
         *     return a.eventType - b.eventType;
         *   })
         * }
         * else {  
         *     console.log('in default 2')
         *   sortedEvents = this.props.events.sort(function(a, b) {
         *     return moment(a.eventDate) - moment(b.eventDate);
         *   });
         * }
         */
      }

    var mappedEvents = sortedEvents.map(event => 
      <ChronologyLineItem event={event} eventId={event._id} key={event._id}/>
    );
    console.log(mappedEvents)
    this.setState({mappedEvents: mappedEvents});
    return mappedEvents
  }

  

  render = () => { 
    const { events } = this.props;
    const { reverse }  = this.state;

    console.log('hutansuhetandi',this.mappedEvents)
    
    if(events) {
      return(<div>
        <div style={{height : 75 + 'px'}}></div>
        <h2> Chronology </h2>

        <div class="container">
          <div class="col-xs-1"></div>
          {/*using the arrow function in the onClick allows for passing in parameters, in the case of reverseSort, it prevents it from being called during the render method.*/} 
          <div class="col-xs-2"><span onClick={() => this.sortEvents('date')}> Date </span></div>
          <div class="col-xs-3"> Person <span onClick={() => this.reverseSort()}>***</span></div>
          <div class="col-xs-2"><span onClick={() => this.sortEvents('type')}> Type </span></div>
          <div class="col-xs-2"> Place <span onClick={() => this.reverseSort()}>***</span></div>
          {this.state.mappedEvents}
        </div>
        
      </div>)
    } else {
      return (<p>Loading...</p>)
    }
  
  }
}
