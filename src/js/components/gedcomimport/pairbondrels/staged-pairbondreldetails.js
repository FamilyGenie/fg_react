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

    return (<div>
      <div class="container">
        <div class="col-xs-12">
          <h1> PairBond Relationship Comparison </h1>
          <button onClick={() => { this.closeModal() }}> Close Modal </button>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-4 title bold can-click">
          Person One
        </div>
        <div class="col-xs-4 title bold can-click">
          Person Two
        </div>
        <div class="col-xs-4 title bold can-click">
          Relationship Type
        </div>
        <div class="col-xs-4 title bold can-click">
          Start Date
        </div>
      </div>
      <div class="container col-xs-12">
        <div class='col-xs-3'>
          <p>{( stagedPersonOne.fName ? stagedPersonOne.fName : '')} {( stagedPersonOne.lName ? stagedPersonTwo.lName : '')}</p>
        </div>
        <div class='col-xs-3'>
          <p>{(stagedPersonTwo.fName ? stagedPersonTwo.fName : '')} {(stagedPersonTwo.lName ? stagedPersonTwo.lName : '')}</p>
        </div>
        <div class='col-xs-3'>
          <p>{stagedPairBondRel.relationshipType}</p>
        </div>
        <div class='col-xs-2'>
          <p>{( stagedPairBondRel.startDate ? stagedPairBondRel.startDate : '')}</p>
        </div>
        <div class='col-xs-1'>
          <button onClick={() => { this.importPairBondRel() }}> Import Record </button>
        </div>
      </div>
      <div class="container col-xs-12">
        {mappedMatches}
      </div>
    </div>)
  }
}
