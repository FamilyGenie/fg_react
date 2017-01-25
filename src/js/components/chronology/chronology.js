import React from 'react';
import { connect } from 'react-redux';

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

  render = () => { 

    var sort_by = (field, reverse, primer) => {
      var key = primer ? 
        function(x) {return primer(x[field])} : 
        function(x) {return x[field]};


        reverse = !reverse ? 1 : -1;

        return function (a, b) {
          return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        } 
    }

    const { events } = this.props;

    const mappedEvents = events.map(event => 
      <ChronologyLineItem event={event} eventId={event._id} key={event._id}/>
    );

    const sortByDate = mappedEvents.sort(sort_by('eventDate', false, parseFloat));

    if(events) {
      return(<div>
        <div style={{height : 75 + 'px'}}></div>
        <h2> Chronology </h2>

        <div class="container">
          <div class="col-xs-1"></div>
          <div class="col-xs-2"> Date </div>
          <div class="col-xs-3"> Person </div>
          <div class="col-xs-2"> Type </div>
          <div class="col-xs-2"> Place </div>
          {sortByDate}
        </div>
        
      </div>)
    } else {
      return (<p>Loading...</p>)
    }
  
  }
}
