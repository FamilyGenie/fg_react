// code for this component used this as a template:
// https://medium.com/the-many/adding-login-and-authentication-sections-to-your-react-or-react-native-app-7767fd251bd1#.puirjnfpq

import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import { getAxiosConfig } from '../../actions/actionFunctions';
import { fetchEvents } from '../../actions/eventsActions';
import { fetchPairBondRels } from '../../actions/pairBondRelsActions';
import { fetchParentalRels } from '../../actions/parentalRelsActions';
import { fetchPeople } from "../../actions/peopleActions";
import { fetchStagedPeople } from '../../actions/stagedPeopleActions';
import { fetchStagedEvents } from '../../actions/stagedEventActions';
import { fetchStagedParentalRels } from '../../actions/stagedParentalRelActions';
import { fetchStagedPairBondRels } from '../../actions/stagedPairBondRelActions';
import { setUserName } from '../../actions/authActions';

@connect(
  (store, ownProps) => {
    return store;
  }
)
export default class EnsureLoggedInContainer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      // if the cookie exists, the user is logged in. The rest of the component will check userName for truthy or falsy to determine if user is logged in or not.
      userName: getAxiosConfig().headers['user-name'],
      currentURL: ''
    }
  }

  componentDidMount() {
    // const { dispatch, currentURL } = this.props

    if (!this.state.userName) {
      // set the current url/path for future redirection (we use a Redux action)
      // then redirect (we use a React Router method)
      // dispatch(setRedirectUrl(currentURL))
      hashHistory.push('/auth/login');
    } else {
      this.props.dispatch(setUserName(this.state.userName));
      this.props.dispatch(fetchPeople());
      this.props.dispatch(fetchEvents());
      this.props.dispatch(fetchPairBondRels());
      this.props.dispatch(fetchParentalRels());
      this.props.dispatch(fetchStagedPeople());
      this.props.dispatch(fetchStagedEvents());
      this.props.dispatch(fetchStagedParentalRels());
      this.props.dispatch(fetchStagedPairBondRels());
    }
  }

  render() {
    if (this.state.userName) {
      return this.props.children;
    } else {
      return (<p>Not Logged In</p>);
    }
  }

}

// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
// function mapStateToProps(state, ownProps) {
//   return {
//     isLoggedIn: state.loggedIn,
//     currentURL: ownProps.location.pathname
//   }
// }
