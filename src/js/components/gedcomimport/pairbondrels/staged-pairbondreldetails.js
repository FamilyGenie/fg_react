import React from 'react';
import { connect } from 'react-redux';

import MatchedPairBondRelLineItem from './matched-pairbondrel-lineitem';
import { importPairBondRel } from '../../../actions/importActions';

@connect(
  (store, ownProps) => {
    if (store.modal.stagedPairBondRel) {
      return{
        stagedPairBondRel: ownProps.stagedPairBondRel,
        stagedPersonOne: ownProps.stagedPersonOne,
        stagedPersonTwo: ownProps.stagedPersonTwo,
        matchedPairBondRels: store.pairBondRels.pairBondRels.filter((p) => {
          return (p.relationshipType === ownProps.stagedPairBondRel.relationshipType && p.startDate === ownProps.stagedPairBondRel.startDate && p.endDate === ownProps.stagedPairBondRel.endDate);
        }),
        closeModal: ownProps.closeModal,
      }
    }
    else {
      console.log('did you for get to pass a pairbondrel');
      // TODO this is silly
      return ownProps
    }
  },
  (dispatch) => {
    return {
      importPairBondRel: (personOne_id, personTwo_id, relationshipType, subType, startDate, endDate, _id) => {
        dispatch(importPairBondRel(personOne_id, personTwo_id, relationshipType, subType, startDate, endDate, _id))
      }
    }
  }
)

export default class StagedPairBondRelDetails extends React.Component {

  closeModal = () => {
    this.props.closeModal();
  }

  importPairBondRel = () => {
    this.props.importPairBondRel(this.props.stagedPersonOne.genie_id, this.props.stagedPersonTwo.genie_id, this.props.stagedPairBondRel.relationshipType, this.props.stagedPairBondRel.subType, this.props.stagedPairBondRel.startDate, this.props.stagedPairBondRel.endDate, this.props.stagedPairBondRel._id)
    this.props.closeModal()
  }

  render = () => {

    const { stagedPairBondRel, stagedPersonOne, stagedPersonTwo, matchedPairBondRels } = this.props;

    const mappedMatches = matchedPairBondRels.map((matchedPairBondRel) => {
      return ( <MatchedPairBondRelLineItem matchedPairBondRel={matchedPairBondRel} stagedId={stagedPairBondRel._id} closeModal={this.props.closeModal} key={matchedPairBondRel._id} /> )
    });

    return (
      <div>
      <div class="stagedModalClose">
        <i class="fa fa-window-close-o fa-2x stagedClose" aria-hidden="true" onClick={this.closeModal}></i>
      </div>
      <h1 class="modalH1"> Parental Relationship Comparison </h1>
      <div class="buffer-modal"></div>
      <div class="stagedHeader1">
        <h3 class="stagedH3"> Potential Import </h3>
      </div>
      <div class="staged-header-container">
        <div class="comparisonNameDiv">
          Person One
        </div>
        <div class="comparisonNameDiv">
          Person Two
        </div>
        <div class="comparisonNameDiv">
          Relationship Type
        </div>
        <div class="comparisonNameDiv">
          Start Date
        </div>
      </div>
      <div class="stagedPerson">
        <div class='stagedChild'>
          <p class='stagedChildFName'>{( stagedPersonOne.fName ? stagedPersonOne.fName : '')}
          </p>
          <p class="stagedChildLName">{( stagedPersonOne.lName ? stagedPersonTwo.lName : '')}</p>
        </div>
        <div class='stagedChild'>
          <p class="stagedChildFName">{(stagedPersonTwo.fName ? stagedPersonTwo.fName : '')}</p>
          <p class="stagedChildLName">{(stagedPersonTwo.lName ? stagedPersonTwo.lName : '')}</p>
        </div>
        <div class='stagedChild'>
          <p class="stagedTypeDate">
            {stagedPairBondRel.relationshipType}
          </p>
        </div>
        <div class='stagedParentStartDate'>
          <p class="stagedTypeDate">
            {( stagedPairBondRel.startDate ? stagedPairBondRel.startDate : '')}
          </p>
        </div>
        <div class='stagedButton'>
          <button class="btn button4" onClick={() => { this.importPairBondRel() }}>Add</button>
        </div>
      </div>
      <div class="pairBondComparisonList">
        <div class="stagedHeader1">
          <h3 class="stagedH3"> Matches In Your System </h3>
        </div>
        <div class="staged-header-container">
          <div class="comparisonNameDiv">
            Person One
          </div>
          <div class="comparisonNameDiv">
            Person Two
          </div>
          <div class="comparisonNameDiv">
            Relationship Type
          </div>
          <div class="comparisonNameDiv">
            Start Date
          </div>
        </div>
        <div class="stagedMapped">
          {mappedMatches}
        </div>
      </div>
      <div class="buffer-modal">
      </div>
      <div class="delete-modal">
        <button onClick={() => { this.closeModal() }} class="btn btn-default modalFooterButton">Close </button>
      </div>
    </div>
    )
  }
}
