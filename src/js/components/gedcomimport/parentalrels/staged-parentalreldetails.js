import React from 'react';
import { connect } from 'react-redux';

import MatchedParentalRelLineItem from './matched-parentalrel-lineitem';
import { importParentalRel } from '../../../actions/importActions';

@connect(
  (store, ownProps) => {
		// for the modal to work, we need to put the parentalRel in store (in the modal object). Passing the parameter from the parent component always results in the last parent showing up in the modal.
		// When we close the modal, there is no parentalRel object in the store, so check for that condition. If there is no parentalRel object found in the store, then just send through ownProps
    if (store.modal.stagedParentalRel) {
      return{
        stagedParentalRel: ownProps.stagedParentalRel,
        stagedChild: ownProps.stagedChild,
        stagedParent: ownProps.stagedParent,
        matchedParentalRels: store.parentalRels.parentalRels.filter((p) => {
          return (p.relationshipType === ownProps.stagedParentalRel.relationshipType && p.startDate === ownProps.stagedParentalRel.startDate && p.endDate === ownProps.stagedParentalRel.endDate);
        }),
        closeModal: ownProps.closeModal,
      }
    }
    else {
      console.log('did you forget to pass a parentalrel');
      // TODO this is silly
      return ownProps
    }
  },
  (dispatch) => {
    return {
      importParentalRel: (child_id, parent_id, relationshipType, subType, startDate, endDate, _id) => {
        dispatch(importParentalRel(child_id, parent_id, relationshipType, subType, startDate, endDate, _id))
      },
    }
  }
)

export default class StagedParentalRelDetails extends React.Component {

  closeModal = () => {
    this.props.closeModal()
  }

  importParentalRel = () => {
    this.props.importParentalRel(this.props.stagedChild.genie_id, this.props.stagedParent.genie_id, this.props.stagedParentalRel.relationshipType, this.props.stagedParentalRel.subType, this.props.stagedParentalRel.startDate, this.props.stagedParentalRel.endDate, this.props.stagedParentalRel._id)
    this.props.closeModal()
  }

  render = () => {

    const { stagedParentalRel, stagedChild, stagedParent, matchedParentalRels } = this.props;

    const mappedMatches = matchedParentalRels.map((matchedParentalRel) => {
      return (<MatchedParentalRelLineItem matchedParentalRel={matchedParentalRel} stagedId={stagedParentalRel._id} key={matchedParentalRel._id} />)
    });


    return (<div>
      <div class="container">
        <div class="col-xs-12">
          <h1> Parental Relationship Comparison </h1>
          <button onClick={() => { this.closeModal() }}> Close Modal </button>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-4 title bold can-click">
          Child
        </div>
        <div class="col-xs-4 title bold can-click">
          Parent
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
          <p>{stagedChild.fName} {stagedChild.lName}</p>
        </div>
        <div class='col-xs-3'>
          <p>{stagedParent.fName} {stagedParent.lName}</p>
        </div>
        <div class='col-xs-3'>
          <p>{stagedParentalRel.subType} {stagedParentalRel.relationshipType}</p>
        </div>
        <div class='col-xs-2'>
          <p>{stagedParentalRel.startDate.substr(0,10)}</p>
        </div>
        <div class='col-xs-1'>
          <button onClick={() => { this.importParentalRel() }}> Import Record </button>
        </div>
      </div>
      <div class="container col-xs-12">
        {mappedMatches}
      </div>
    </div>)
  }
}


