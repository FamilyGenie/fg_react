import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import moment from 'moment';

import DateInput from '../../date-input';
import StagedParentalRelDetails from './staged-parentalreldetails';
import { setStagedParentalRel } from '../../../actions/modalActions';

@connect(
  (store, ownProps) => {
    return {
      stagedParentalRel: ownProps.stagedParentalRel,
      stagedChild:
        store.stagedPeople.stagedPeople.find((p) => {
          return p.personId === ownProps.stagedParentalRel.child_id;
        }),
      stagedParent:
        store.stagedPeople.stagedPeople.find((p) => {
          return p.personId === ownProps.stagedParentalRel.parent_id;
        }),
    }
  },
  (dispatch) => {
    return {
      setStagedParentalRel: (stagedParentalRel) => {
        dispatch(setStagedParentalRel(stagedParentalRel));
      }
    }
  }
)

export default class StagedParentalRelsSearchLineItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {modalIsOpen: false};
  }


  reviewParentalRel = () => {
    console.log(this.props.stagedParentalRel)
    this.props.setStagedParentalRel(this.props.stagedParentalRel);
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  getUpdateDate = (field, displayDate, setDate) => {
    return (field, displayDate, setDate) => {
    }
  }

	newDate = (date) => {
		try {
			var nDate = moment(date).format('MMM DD YYYY');
			if (nDate === 'Invalid date') {
				nDate = '';
			}
			return nDate
		}
		catch(TypeError) {
			return '';
		}
	}


  render = () => {
    const { stagedParentalRel, stagedChild, stagedParent } = this.props;
    const { modalIsOpen } = this.state;


    return(
      <div class="staged-item">
        <div class='stagedNameDiv2'>
          <p class="staged-name">{stagedParent.fName}</p>
  				<p class="staged-name">{stagedParent.lName}</p>
        </div>
        <div class='stagedNameDiv3'>
          <p class="staged-name">{stagedChild.fName}</p>
  				<p class="staged-name">{stagedChild.lName}</p>
        </div>
        <div class='stagedRelType'>
          <p class='staged-name'>{stagedParentalRel.relationshipType}</p>
        </div>
        <div class='stagedStartDate'>
          <p class='staged-name'>{moment(stagedParentalRel.startDate).format('MMM DD YYYY')}</p>
        </div>
  			<div class="check-duplicate">
  				<i class="fa fa-users fa-2x button2" aria-hidden="true" onClick={() => {this.reviewParentalRel()}}></i>
  			</div>
        <Modal
          isOpen={modalIsOpen}
          contentLabel="Modal"
        >
          <StagedParentalRelDetails closeModal={this.closeModal} stagedParentalRel={stagedParentalRel} stagedChild={stagedChild} stagedParent={stagedParent} />
        </Modal>
      </div>
    );
  }
}
