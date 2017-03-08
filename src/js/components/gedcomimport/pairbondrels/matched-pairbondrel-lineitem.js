import React from 'react';
import { connect } from 'react-redux';

import { updateStagedPairBondRel } from '../../../actions/stagedPairBondRelActions';

@connect(
  (store, ownProps) => {
    console.log('in matchedpairbondlineitem with:', ownProps)
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
    console.log(this.props.matchedPairBondRel._id,this.props.stagedId)
    this.props.updateStagedPairBondRel(this.props.stagedId, 'genie_id', this.props.stagedId);
    this.props.updateStagedPairBondRel(this.props.stagedId, 'ignore', true);
    this.props.closeModal();
  }

  render = () => {

    const { stagedId, matchedPairBondRel, matchedPersonOne, matchedPersonTwo } = this.props;
    console.log('in matchedpairbondlineitem with: ', this.props)

    if (matchedPairBondRel) {
      return (<div>
        <div class="infoRow">
          <div class="nameCol">
            <p>{(matchedPersonOne.fName ? matchedPersonOne.fName : '' )}&nbsp; {(matchedPersonOne.lName ? matchedPersonOne.lName : '')}</p>
          </div>
          <div class="nameCol">
            <p>{(matchedPersonTwo.fName ? matchedPersonTwo.fName : '')}&nbsp; {(matchedPersonTwo.lName ? matchedPersonTwo.lName : '')}</p>
          </div>         
          <div class="nameCol">
            <p>{matchedPairBondRel.subType}&nbsp; {matchedPairBondRel.relationshipType}</p>
          </div>         
          <div class="relTypeCol">
            <button onClick={() => {this.useRecord()}}> Use This Record </button>
          </div>
        </div>
      </div>);
    }
    else {
      return (<p>Loading...</p>)
    }
  }
}
