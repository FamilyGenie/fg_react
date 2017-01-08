import React from 'react';
import { connect } from 'react-redux';

@connect(
  (store, ownProps) => {
    console.log('in staged-parental-rel@connect with: ', store);
    return {
      stagedParent:
      store.stagedParentalRel.find(function(p) {
        return p._id === ownProps.parentalRel.parent_id;
      }),
      parentalRel:
        ownProps.parentalRel,
    };
  },
)
export default class StagedParentalRelLineItem extends React.Component {

  render = () => {

    const { stagedParent, parentalRel } this.props;

    const parentFName = (stagedParent ? parent.fName : 'Click to Edit');
    const parentLName = (stagedParent ? parent.lName : ' ');

    if (parentalRel) {
      return(<div>
        <div class="infoRow">
          <div class="nameCol">
            {parentFName} {parentLName}
          </div>
          <div class="relTypeCol">
            {parentalRel.subType} {parentalRel.relationshipType}
          </div>
        </div>
      </div>)
    } else {
      return (<p>Loading Parental Relationships...</p>);
    }
  }
}
