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
      return(
      <div class="main-div">
        <div class="header-div">
          <h1 class="family-header"> Chronology </h1>
        </div>
        <div class="staged-container">
          <div class='staged-header-container'>
            <div class="staged-header">
              {/*using the arrow function in the onClick allows for passing in parameters, in the case of reverseSort, it prevents it from being called during the render method.*/}
              <span onClick={() => this.sortEvents('date')}> Date </span>
            </div>
            <div class="staged-header">
              <p>Person</p>
            </div>
            <div class="staged-header">
              <span onClick={() => this.sortEvents('type')}>Type</span>
            </div>
            <div class="staged-header">
              <p>Place</p>
            </div>
            <div class="stagedHeaderReview">
              <p>Review</p>
            </div>
          </div>
        <div class="staged-people-list">
          {this.state.mappedEvents}
          <div class="staged-item">
      			<div class="stagedElement">
      				<p class="staged-name">1990-08-15</p>
      			</div>
      			<div class="stagedElement">
      				<p class="staged-name">Henry Brigham V</p>
      			</div>
      			<div class="stagedElement">
      				<p class="staged-name">Birth</p>
      			</div>
      			<div class="stagedElement">
      				<p class="staged-name">Austin, Tx</p>
      			</div>
      			<div class="check-duplicate">
      				<i class="fa fa-users fa-2x button2" aria-hidden="true" onClick={this.openDetails}></i>
      			</div>
      		</div>
        </div>
      </div>
    </div>
    )
    } else {
      return (<p>Loading...</p>)
    }

  }
}
