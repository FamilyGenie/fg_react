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
            Child
          </div>
          <div class="comparisonNameDiv">
            Parent
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
            <p class='stagedChildFName'>{stagedChild.fName}</p>
            <p class='stagedChildLName'>{stagedChild.lName}</p>
          </div>
          <div class='stagedChild'>
            <p class='stagedChildFName'>{stagedParent.fName}</p>
            <p class='stagedChildLName'>{stagedParent.lName}</p>
          </div>
          <div class='stagedChild'>
            <p class="stagedTypeDate">{stagedParentalRel.subType} {stagedParentalRel.relationshipType}</p>
          </div>
          <div class='stagedParentStartDate'>
            <p class="stagedTypeDate">
              {stagedParentalRel.startDate.substr(0,10)}
            </p>
          </div>
          <div class='stagedButton'>
            <button onClick={() => { this.importParentalRel() }} class="btn button4">Add</button>
          </div>
        </div>
        <div class="parentComparisonList">
          <div class="stagedHeader1">
            <h3 class="stagedH3"> Matches In Your System </h3>
          </div>
          <div class="staged-header-container">
            <div class="comparisonNameDiv">
              Child
            </div>
            <div class="comparisonNameDiv">
              Parent
            </div>
            <div class="comparisonNameDiv">
              Relationship Type
            </div>
            <div class="comparisonNameDiv">
              Start Date
            </div>
          </div>
          {mappedMatches}
        </div>
        <div class="buffer-modal">
        </div>
        <div class="delete-modal">
          <button onClick={() => { this.closeModal() }} class="btn btn-default modalFooterButton">Close </button>
        </div>
      </div>
    );
  }
}
