import React from 'react';
import { connect } from 'react-redux';

//import { updateStagedPairBondRel } from '../../../actions/stagedPairBondRelActions';

@connect(
  (store, ownProps) => {
    console.log('in matchedpairbondlineitem with:', ownProps)
    return {
      stagedId: ownProps.stagedId,
      matchedPairBondRel: ownProps.matchPairBondRel,
      matchedPersonOne:
      store.people.people.find((p) => {
        return p._id === ownProps.matchedPairBondRel.personOne_id;
      }),
      matchedPersonTwo:
      store.people.people.find((p) => {
        return p._id === ownProps.matchedPairBondRel.personTwo_id;
      }),
    };
  },
  (dispatch) => {
    return {
      //updateStagedPairBondRel: (_id, field, value) => {
        //dispatch(updateStagedPairBondRel(_id, field, value))
      // }
    }
  }
)

export default class MatchedPairBondRelLineItem extends React.Component {
  
  useRecord = () => {
    //this.props.updateStagedPairBondRel(this.props.matchedPairBondRel._id, 'genie_id', this.props.stagedId)
    //this.props.updateStagedPairBondRel(this.props.matchedPairBondRel._id, 'ignore', true)
  }

  render = () => {

    const { stagedId, matchedPairBondRel, matchedPersonOne, matchedPersonTwo } = this.props;
    console.log('in matchedpairbondlineitem with: ', this.props)

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
