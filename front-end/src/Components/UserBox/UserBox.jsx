import React, { Component, Fragment } from 'react';
import './UserBox.css';

import { GoogleLogin, GoogleLogout } from 'react-google-login';

class UserBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authenticated: false,
            user: undefined
        };

        this.onLoginSuccess = this.onLoginSuccess.bind(this);
        this.onLoginFailure = this.onLoginFailure.bind(this);
        this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
        this.onLogoutFailure = this.onLogoutFailure.bind(this);
    }

    componentDidMount() {

    }

    componentWillMount() {
        let idToken = localStorage.getItem('idToken');
        if (idToken) {
            // console.log("Found cached id token");
            this.performGoogleLogin(idToken);
        }
    }

    performGoogleLogin(idToken) {
        // console.log("Performing login with token: " + idToken);
        fetch('/api/v1/auth/google/login', {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: idToken
            })
        })
            .then(this.checkStatus)
            .then(user => {
                localStorage.setItem('idToken', idToken);
                this.setState({
                    authenticated: true,
                    user: user
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    checkStatus(res) {
        if (res.status >= 200 && res.status < 300) {
            return res
        } else {
            let err = new Error(res.statusText)
            err.response = res
            throw err
        }
    }

    performGoogleLogout() {
        console.log("Performing log out");
        localStorage.clear(); //TODO maybe cherry-pick
        this.setState({
            authenticated: false,
            user: undefined
        })
    }

    onLoginSuccess(response) {
        let idToken = response.tokenId;
        this.performGoogleLogin(idToken);
    }

    onLoginFailure(response) {
        console.log(response);
    }

    onLogoutSuccess() {
        this.performGoogleLogout();
    }

    onLogoutFailure() {
    }

    render() {
        return (
            <div className="UserBox-Component">
                {this.state.authenticated ?
                    <GoogleLogout
                        clientId="720087900394-emhkhqeh8m9nhq1mm07td42iuihbu56i.apps.googleusercontent.com"
                        onLogoutSuccess={this.onLogoutSuccess}
                        onLogoutFailure={this.onLogoutFailure}

                        buttonText="Logout"
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled}>Log Out</button>
                        )}
                    />
                    :
                    <GoogleLogin
                        clientId="720087900394-emhkhqeh8m9nhq1mm07td42iuihbu56i.apps.googleusercontent.com"
                        onSuccess={this.onLoginSuccess}
                        onFailure={this.onLoginFailure}

                        buttonText="Login"
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled}>Log In</button>
                        )}
                    />
                }
            </div>
        );
    }
}
export default UserBox;