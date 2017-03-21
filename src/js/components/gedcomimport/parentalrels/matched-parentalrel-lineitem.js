import React from 'react';
import { connect } from 'react-redux';

import { updateStagedParentalRel } from '../../../actions/stagedParentalRelActions'

@connect(
  (store, ownProps) => {
    return {
      stagedId: ownProps.stagedId,
      matchedParentalRel:
        ownProps.matchedParentalRel,
      matchedChild:
      store.people.people.find((c) => {
        return c._id === ownProps.matchedParentalRel.child_id;
      }),
      matchedParent:
      store.people.people.find((p) => {
        return p._id === ownProps.matchedParentalRel.parent_id;
      }),
    };
  },
  (dispatch) => {
    return {
      updateStagedParentalRel: (_id, field, value) => {
        dispatch(updateStagedParentalRel(_id, field, value))
      }
    }
  }
)

export default class MatchedParentalRelLineItem extends React.Component {

  useRecord = () => {
    this.props.updateStagedParentalRel(this.props.stagedId, 'genie_id', this.props.matchedParentalRel._id);
    this.props.updateStagedParentalRel(this.props.stagedId, 'ignore', 'true');
  }

  render = () => {

    const { stagedId, matchedParentalRel, matchedChild, matchedParent } = this.props;

    if (matchedParentalRel) {
      return (
        <div class="stagedPerson">
          <div class="stagedChild">
            <p class="stagedChildFName">{matchedChild.fName}&nbsp; </p>
            <p class="stagedChildLName">{matchedChild.lName}</p>
          </div>
          <div class="stagedChild">
            <p class="stagedChildFName">{matchedParent.fName}&nbsp;
            </p>
            <p class="stagedChildLName">{matchedParent.lName}</p>
          </div>
          <div class="stagedChild">
            <p class="stagedChildFName">
              {matchedParentalRel.subType}
            </p>
            <p class="stagedChildLName">
              {matchedParentalRel.relationshipType}
            </p>
          </div>
          <div class="stagedButton">
            <button class="btn button4" onClick={() => {this.useRecord()}}>Use</button>
          </div>
        </div>
      );
    }
  }
}
