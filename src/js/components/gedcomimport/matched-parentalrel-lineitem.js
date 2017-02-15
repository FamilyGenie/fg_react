import React from 'react';
import { connect } from 'react-redux';

@connect(
  (store, ownProps) => {
    console.log('in matched-parentalrel-lineitem@connect with: ', store, ownProps);
    return {
      matchedParent:
      store.parentalRel.find(function(p) {
        return p._id === ownProps.parentalRel.parent_id;
      }),
      parentalRel:
        ownProps.stagedParentalRel,
    };
  },
)

export default class MatchedParentalRelLineItem extends React.Component {

  render = () => {

    const { matchedParent, parentalRel } = this.props;

    const parentFName = (matchedParent ? parent.fName : 'Click to Edit');
    const parentLName = (matchedParent ? parent.lName : ' ');

    if (parentalRel) {
      return (<div>
        <div class="infoRow">
          <div class="nameCol">
            {parentFName} {parentLName}
          </div>
          <div class="relTypeCol">
            {parentalRel.subType} {parentalRel.relationshipType}
          </div>
        </div>
      </div>)
    }
  }
}
