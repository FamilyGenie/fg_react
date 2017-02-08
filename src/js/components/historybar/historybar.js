import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { closeHistoryBar, openHistoryBar } from '../../actions/historyBarActions';

@connect(
  (store, ownProps) => {
    return {
      store: store,
    }
  },
  (dispatch) => {
    return {
      closeHistoryBar: () => {
        dispatch(closeHistoryBar());
      },
      openHistoryBar: () => {
        dispatch(openHistoryBar());
      },
    }
  }
)
export default class HistoryBar extends React.Component {
  constructor(props){
    super(props);
  }


  openHistoryBar = () => {
    this.props.openHistoryBar();
  }

  closeHistoryBar = () => {
    this.props.closeHistoryBar();
  }

  render = () => {
    return (
      <div class="help-div">
        <div id="helpHide">
          <i class="fa fa-plus-square fa-2x button2" aria-hidden="true" onClick={this.openHistoryBar}></i>
        </div>
        <div class="main-history" id="helpHistory">
          <div class="help-menu">
            <div class="help-header">
              <div class="blank-person-header">
              </div>
              <h3 class="history-title-1">Help Menu</h3>
              <div class="help-close">
                <i class="fa fa-minus-square fa-2x" aria-hidden="true" onClick={this.closeHistoryBar}></i>
              </div>
            </div>
          </div>
          <div class="history-context">
            <h3 class="history-title-2">Your History</h3>
            <div class="histories">
              <div class="history">
              </div>
              <div class="history">
              </div>
              <div class="history">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
