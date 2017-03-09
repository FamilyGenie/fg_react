import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/authActions';
import AlertContainer from 'react-alert';

@connect(
	// test
	(store, ownProps) => {
		return store;
	},
	(dispatch) => {
		return {
			// get the parentalRel object that needs to appear in the modal
			login: (userName, password) => {
				dispatch(login(userName, password, true));
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
	submitCredentials = (evt) => {
		// this next line will prevent the default form behavior which is to call the submit event of the form, which refreshes the form and causes it to not log the user in
		evt.preventDefault();
		this.props.login(this.state.email, this.state.password);
	}

	// TODO: need to figure out how to make this so that you don't have to blur out of the fields in order for what the user has entered to be able to be passed to the login method. I don't know how do do this in React.
	updateEmail = (evt) => {
		this.setState({email: evt.target.value});
	}

	updatePassword = (evt) => {
		this.setState({password: evt.target.value});

	}

	alertOptions = {
      offset: 600,
      position: 'middle',
      theme: 'light',
      time: 0,
      transition: 'scale'
    };

    componentDidMount = () => {
    	this.setState({
    		email: document.getElementById('userName').value,
    		password: document.getElementById('password').value
    	});

    	console.log('in login componentDidMount: ', document.getElementById('userName').value, document.getElementById('password').value);
    }

	render = () => {
	    return (
	    	<div class="mainDiv">
					<div className="login-body">
						<form className="authForm">
							<div className="login-h3">
								<p className="loginHeader">Log In</p>
								{/*<a className="or-sign-up" onClick={this.signUpClick}>Or, Sign Up</a>*/}
							</div>
							<br/>
							<div class="login-inputs">
								<input
										type="email"
										name="email"
										class="form-control form"
										id="userName"
										placeholder="Enter email"
										required
										onChange={this.updateEmail.bind(this)}

								/>
								<input
									type="password"
									class="form-control form"
									id="password"
									placeholder="Enter password"
									required
									onChange={this.updatePassword.bind(this)}

								/>
							</div>
							<br/>
							<div className="w-login-button">
								<button onClick={this.submitCredentials.bind(this)} className="btn w-l-button btn-info">LOG IN
								</button>
							</div>
							<div className="checkbox">
								{/*<label className="rememberUser"><input type="checkbox" value=""/>Remember Me</label>*/}
								<a className="forgot" href="">Forgot password?</a>
							</div>
						</form>
					</div>
					{/* This is the container for the alerts we are using */}
			    	<AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
		    </div>
		)
    }
}
