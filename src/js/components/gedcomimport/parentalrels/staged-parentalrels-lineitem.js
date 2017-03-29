import React from 'react';
import { connect } from 'react-redux';

@connect(
  (store, ownProps) => {
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


    if (parentalRel) {
      return
        (<div>
          <div class="infoRow">
            <div class="nameCol">
              {(stagedParent ? stagedParent.fName : 'Click to Edit')} {(stagedParent ? stagedParent.lName : ' ')}
            </div>
            <div class="relTypeCol">
              {parentalRel.subType} {parentalRel.relationshipType}
            </div>
          </div>
        </div>
      );
    } else {
      return (<p>Loading Parental Relationships...</p>);
    }
  }
}
