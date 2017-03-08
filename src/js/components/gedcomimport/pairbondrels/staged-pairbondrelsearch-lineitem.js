import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import moment from 'moment';

import DateInput from '../../date-input';
import StagedPairBondRelDetails from './staged-pairbondreldetails';
import { setStagedPairBondRel } from '../../../actions/modalActions';

@connect(
  (store, ownProps) => {
    return {
      stagedPairBondRel: ownProps.stagedPairBondRel,
      // find the staged people so we can display the names for the user
      stagedPersonOne:
        store.stagedPeople.stagedPeople.find((p) => {
          return p.personId === ownProps.stagedPairBondRel.personOne_id;
        }),
      stagedPersonTwo:
        store.stagedPeople.stagedPeople.find((p) => {
          return p.personId === ownProps.stagedPairBondRel.personTwo_id;
        }),
    }
  },
  (dispatch) => {
    return {
      setStagedPairBondRel: (stagedPairBondRel) => {
        dispatch(setStagedPairBondRel(stagedPairBondRel));
      },
    }
  }
)

export default class StagedPairBondRelSearchLineItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  reviewPairBondRel = () => {
    this.props.setStagedPairBondRel(this.props.stagedPairBondRel);
    this.setState({modalIsOpen: true});

  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  render = () => {
    const { stagedPairBondRel, stagedPersonOne, stagedPersonTwo } = this.props;
    console.log('in stagedpairbondrelsearch-lineitem RENDER with: ', this.props)
    const { modalIsOpen } = this.state;

    return (<div>
      <div class='staged-parent'>
        <p class="staged-name">{stagedPersonOne.fName}</p>
				<p class="staged-name">{stagedPersonOne.lName}</p>
      </div>
      <div class='staged-child'>
        <p class="staged-name">{stagedPersonTwo.fName}</p>
				<p class="staged-name">{stagedPersonTwo.lName}</p>
      </div>
      <div class='staged-reltype'>
        <p class='staged-name'>{stagedPairBondRel.relationshipType}</p>
      </div>
      <div class='staged-startdate'>
        <p class='staged-name'>{moment(stagedPairBondRel.startDate).format('MMM DD YYYY')}</p>
      </div>
			<div class="check-duplicate">
				<i class="fa fa-users fa-2x button2" aria-hidden="true" onClick={() => {this.reviewPairBondRel()}}></i>
			</div>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Modal"
      >
        <StagedPairBondRelDetails closeModal={this.closeModal} stagedPairBondRel={stagedPairBondRel} stagedPersonOne={stagedPersonOne} stagedPersonTwo={stagedPersonTwo} />
      </Modal>
    </div>)
  }

}
