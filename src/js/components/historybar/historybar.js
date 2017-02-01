import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

@connect(
  (store, ownProps) => {
    return {
      store: store,
    }
  }
)
export default class HistoryBar extends React.Component {

  render = () => {
    return (
      <div class="main-history">
        <div class="help-menu">
          <h3 class="history-title">Help Menu</h3>
        </div>
        <div class="history-context">
          <h3 class="history-title">Your History</h3>
          <div class="histories">
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
            <div class="history">
            </div>
          </div>
        </div>
      </div>
    );
  }
}
