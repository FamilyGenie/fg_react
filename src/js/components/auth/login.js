import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/authActions';

@connect(
	// test
	(store, ownProps) => {
		return store;
	},
	(dispatch) => {
		return {
			// get the parentalRel object that needs to appear in the modal
			login: (userName, password) => {
				dispatch(login(userName, password));
			},
		}
	}
)
export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		}
	}

	// when creds are submitted, call the login action from authActions
	submitCredentials = () => {
		this.props.login(this.state.email, this.state.password);
	}

	// TODO: need to figure out how to make this so that you don't have to blur out of the fields in order for what the user has entered to be able to be passed to the login method. I don't know how do do this in React.
	updateEmail = (evt) => {
		this.setState({email: evt.target.value});
	}

	updatePassword = (evt) => {
		this.setState({password: evt.target.value});

	}

	render = () => {
	    return (
	    	<div class="container main">
		        <h4><span class="glyphicon glyphicon-lock"></span> Login</h4>
		        <div class="container">
		            <form role="form">
		                <div class="form-group userName">
		                    <label for="userName"><span class="glyphicon glyphicon-user"></span> Username</label>
		                    <input
		                            type="email"
		                            name="email"
		                            class="form-control"
		                            id="userName"
		                            placeholder="Enter email"
		                            required
		                            onBlur={this.updateEmail.bind(this)}

		                    />
		                </div>
		                <div class="form-group">
		                    <label for="psw"><span class="glyphicon glyphicon-eye-open"></span> Password</label>
		                    <input
		                            type="password"
		                            class="form-control"
		                            id="psw"
		                            placeholder="Enter password"
		                            required
		                            onBlur={this.updatePassword.bind(this)}

		                    />
		                </div>
		                <button
		                        type="submit"
		                        class="btn btn-default btn-success btn-block loginButton"
		                        data-dismiss="modal"
		                        onClick={this.submitCredentials.bind(this)}
		                >
		                    <span class="glyphicon glyphicon-off"></span> Login
		                </button>
		            </form>
		        </div>
		    </div>
		)
    }
}
