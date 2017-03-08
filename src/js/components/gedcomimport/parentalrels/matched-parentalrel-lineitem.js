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
      return (<div>
        <div class="infoRow">
          <div class="nameCol">
            <p>{matchedChild.fName}&nbsp; {matchedChild.lName}</p>
          </div>
          <div class="nameCol">
            <p>{matchedParent.fName}&nbsp; {matchedParent.lName}</p>
          </div>         
          <div class="nameCol">
            <p>{matchedParentalRel.subType}&nbsp; {matchedParentalRel.relationshipType}</p>
          </div>         
          <div class="relTypeCol">
            <button onClick={() => {this.useRecord()}}> Use This Record </button>
          </div>
        </div>
      </div>);
    }
  }
}
