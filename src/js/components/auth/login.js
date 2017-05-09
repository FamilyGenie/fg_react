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
				dispatch(login(userName, password, true));
			},
		}
	}
)
export default class Login extends React.Component {

	// when creds are submitted, call the login action from authActions
	submitCredentials = (evt) => {
		// this next line will prevent the default form behavior which is to call the submit event of the form, which refreshes the form and causes it to not log the user in
		evt.preventDefault();
		this.props.login(document.getElementById('userName').value, document.getElementById('password').value);
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
								/>
								<input
									type="password"
									class="form-control form"
									id="password"
									placeholder="Enter password"
									required
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
			</div>
		)
	}
}
