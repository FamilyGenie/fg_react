import React from 'react';
import { connect } from 'react-redux';

import { updateStagedPairBondRel } from '../../../actions/stagedPairBondRelActions';

@connect(
  (store, ownProps) => {
    return {
      stagedId: ownProps.stagedId,
      matchedPairBondRel: ownProps.matchedPairBondRel,
      matchedPersonOne:
      store.people.people.find((p) => {
        return p._id === ownProps.matchedPairBondRel.personOne_id;
      }),
      matchedPersonTwo:
      store.people.people.find((p) => {
        return p._id === ownProps.matchedPairBondRel.personTwo_id;
      }),
      closeModal: ownProps.closeModal,
    };
  },
  (dispatch) => {
    return {
      updateStagedPairBondRel: (_id, field, value) => {
        dispatch(updateStagedPairBondRel(_id, field, value))
      },
    }
  }
)

export default class MatchedPairBondRelLineItem extends React.Component {

  useRecord = () => {
    this.props.updateStagedPairBondRel(this.props.stagedId, 'genie_id', this.props.stagedId);
    this.props.updateStagedPairBondRel(this.props.stagedId, 'ignore', true);
    this.props.closeModal();
  }

  render = () => {

    const { stagedId, matchedPairBondRel, matchedPersonOne, matchedPersonTwo } = this.props;

    if (matchedPairBondRel) {
      return (
        <div class="stagedPerson">
          <div class="stagedChild">
            <p class="stagedChildFName">{(matchedPersonOne ? matchedPersonOne.fName : '' )}&nbsp;</p>
            <p class="stagedChildLName">{(matchedPersonOne ? matchedPersonOne.lName : '')}</p>
          </div>
          <div class="stagedChild">
            <p class="stagedChildFName">{(matchedPersonTwo ? matchedPersonTwo.fName : '')}&nbsp;</p>
            <p class="stagedChildLName">{(matchedPersonTwo ? matchedPersonTwo.lName : '')}</p>
          </div>
          <div class="stagedChild">
            <p class="stagedChildLName">
              {matchedPairBondRel.relationshipType}
            </p>
          </div>
          <div class="stagedButton">
            <button class="btn button4" onClick={() => {this.useRecord()}}>Use</button>
          </div>
        </div>
      );
    }
    else {
      return (<p>Loading...</p>)
    }
  }
}
