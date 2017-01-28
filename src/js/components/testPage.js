import React, {PropTypes} from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import AlertContainer from 'react-alert';

import { newPerson } from '../actions/newPersonActions';
import NewPerson from './newperson';

@connect(
  (store, ownProps) => {
    return {
      people: store.people.people,
      modalIsOpen: store.modal.newPerson.modalIsOpen,
      store, 
      ownProps,
    };
  },
  (dispatch) => {
    return {
      newPerson: () => {
        dispatch(newPerson());
      },
    }
  }
)
export default class TestNewPerson extends React.Component {
  constructor(props){
    super(props);
    this.alertOptions = {
      offset: 300,
      position: 'middle',
      theme: 'light',
      time: 0,
      transition: 'scale'
    };
  }

  createNewPerson = () => {
    this.props.newPerson();
  }

  showAlert = () => {
    msg.show('Need to add details for new person before leaving this page', {
      time: 0,
      type: 'error',
    });
  }

  render = () => {

    var modalStyle = {
      overlay: {
      position: 'fixed',
      top: 100,
      left: 100,
      right: 100,
      bottom: 100,
      }
    };


  const { people, store, ownProps, modalIsOpen } = this.props

    return (<div>

      <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
      <button onClick={this.showAlert}>Show Alert</button>


      <button onClick={this.createNewPerson}> New Person </button>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Modal"
        style={modalStyle}
      >
        <NewPerson/>
      </Modal>

    </div>);

  }
}
