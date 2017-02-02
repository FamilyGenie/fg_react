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

  closeHelp = () => {
    $("#helpHistory").css("display", "none");
    $("#helpHide").css("display", "block");
  }
  openHelp = () => {
    $("#helpHide").css("display", "none");
    $("#helpHistory").css("display", "block");
  }
//   $("#id").css("display", "none");
// $("#id").css("display", "block");

  render = () => {
    return (
      <div class="help-div">
        <div id="helpHide">
          <i class="fa fa-plus-square fa-2x button2" aria-hidden="true" onClick={this.openHelp}></i>
        </div>
        <div class="main-history" id="helpHistory">
          <div class="help-menu">
            <div class="help-header">
              <div class="blank-person-header">
              </div>
              <h3 class="history-title">Help Menu</h3>
              <div class="help-close">
                <i class="fa fa-minus-square fa-2x button2" aria-hidden="true" onClick={this.closeHelp}></i>
              </div>
            </div>
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
      </div>
    );
  }
}
