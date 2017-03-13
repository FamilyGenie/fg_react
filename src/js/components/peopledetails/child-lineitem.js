import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

@connect(
  (store, ownProps) => {
    return {
      child: ownProps.child,
    };
  },
)

export default class ChildLineItem extends React.Component {

  goToChild = () => {
    hashHistory.push('/peopledetails/' + this.props.child._id);
  }
  
  render = () => {
    const { child } = this.props;

    return (
      <div class="chronology-row">
        <div class="inner-event-name">
          <div class="relTypeWord"
            onClick={this.goToChild}> {child.fName}&nbsp;{child.lName} </div>
        </div>
        <div class="relTypeCol">
          <div class="ital"> { child.relType } </div>
          <div class="ital"> { child.subType } </div>
        </div>
      </div>
    )
  }
}
