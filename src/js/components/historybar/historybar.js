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
  constructor(props){
    super(props);
    this.state = {
      hiddenHistory: false,
    }
  }
  // closeHelp = () => {
  //   $("#helpHistory").css("display", "none");
  //   $("#helpHide").css("display", "block");
  //   $(".main").css("margin-left", "auto");
  //   $(".main").css("margin-right", "auto");
  // }
  // openHelp = () => {
  //   $("#helpHide").css("display", "none");
  //   $("#helpHistory").css("display", "block");
  // }
  selectedStyle = () => {
    console.log(this.state.hiddenHistory, "hide the history!");
    this.setState ({
      hiddenHistory: !this.state.hiddenHistory,
    })
    if (this.state.hiddenHistory) {
      var mainStyle = {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#E9EBEE",
        zIndex: 0,
        position: "relative",
        minHeight: 100 + "vh",
        marginRight: 300 + "px",
      }
    }
    else {
      var mainStyle = {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#E9EBEE",
        zIndex: 0,
        position: "relative",
        minHeight: 100 + "vh",
        marginRight: 0,
      }
    }
    return mainStyle;
  }

  render = () => {
    return (
      <div class="help-div">
        <div id="helpHide">
          <i class="fa fa-plus-square fa-2x button2" aria-hidden="true" onClick={this.selectedStyle}></i>
        </div>
        <div class="main-history" id="helpHistory">
          <div class="help-menu">
            <div class="help-header">
              <div class="blank-person-header">
              </div>
              <h3 class="history-title-1">Help Menu</h3>
              <div class="help-close">
                <i class="fa fa-minus-square fa-2x" aria-hidden="true" onClick={this.selectedStyle}></i>
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
