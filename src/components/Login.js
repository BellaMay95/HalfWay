import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { app } from '../base';
import { FormControl, FormGroup, ControlLabel, HelpBlock, Button, Alert, Jumbotron } from 'react-bootstrap';
import logo from '../images/HWtrial21.png';
import '../login.css';

//import firebase from 'firebase';
//require("firebase/functions");


//import logo from './logo.svg';

/*part of the react-bootstrap form component*/
function FieldGroup({ id, label, help, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.authUser = this.authUser.bind(this);
        this.onChange = this.onChange.bind(this);
        this.loginWithUsername = this.loginWithUsername.bind(this);
        this.state = {
            redirect: false,
			email: "",
            password: "",
            alertShow: 0,
            isLoading: false
        }
    }

    //updates state variables when form fields change
    onChange(event) {
        //event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        //console.log(name + ": " + value);
        this.setState({[name]: value});
    }

    authUser(event) {
        event.preventDefault();
        this.setState({isLoading: true});
        //regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        // eslint-disable-next-line
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        //checks for empty fields
        if (this.state.email === "" || this.state.password === "") {
        	this.setState({alertShow: 1, isLoading: false });
            //shows alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({alertShow: 0});
            }, 5000);
            console.log("You have one or more empty fields!");
            return;
        }
        else if (emailRegex.test(this.state.email)) { //make sure this could possibly be a valid email
            this.loginWithUsername(this.state.email);
        } else {
            this.setState({alertShow: 2, isLoading: false });
            //shows alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({alertShow: 0});
            }, 5000);
            console.log("Invalid email format!");
            return;
        }
    }

    loginWithUsername(username) {
        const email = username;
        const password = this.state.password;

        app.auth().fetchProvidersForEmail(email)
        .then((providers) => {
            //tests whether account exists
            if (providers.length === 0) {
                this.setState({alertShow: 3, isLoading: false});
                //show alert for 5 seconds
                window.setTimeout(() => {
                    this.setState({alertShow: 0});
                }, 5000);
                console.log("This account does not exist!");
            }
            //checks for valid password?
            else if (providers.indexOf("password") === -1) {
                this.setState({alertShow: 3, isLoading: false});
                //showing alert for 5 seconds
                window.setTimeout(() => {
                    this.setState({alertShow: 0});
                }, 5000);
                console.log("invalid login credentials!");
            } else {
                //good credentials, now sign in
                return app.auth().signInWithEmailAndPassword(email, password);
            }
        })
        .then((user) => {
            //resets form, sets user, clears component state
            if (user && user.email) {
                this.loginForm.reset();
                this.props.setCurrentUser(user);
                this.setState({
                    redirect: true,
                    username: "",
                    password: "",
                    isLoading: false
                });
            }
        })
        .catch((error) => {
            //console.log("Error!");
            console.log(error);
            if (error.code === "auth/wrong-password") {
                this.setState({alertShow: 3, isLoading: false});
                //showing alert for 5 seconds
                window.setTimeout(() => {
                    this.setState({alertShow: 0});
                }, 5000);
            }
            else {
                this.setState({alertShow: 4, isLoading: false});
                //showing alert for 5 seconds
                window.setTimeout(() => {
                    this.setState({alertShow: 0});
                }, 5000);
            }
        });
    }

    render() {
        /*redirects user to requested page if not the home page*/
        const { from } = this.props.location.state || { from: { pathname: '/' } }

        if (this.state.redirect === true) {
            return <Redirect to={from} />
        }

        let loginAlert = null;
    	if (this.state.alertShow === 0) {
    		loginAlert = null;
    	}
    	else if (this.state.alertShow === 1) {
    		loginAlert = <Alert bsStyle = "warning"><strong>One or more required fields are empty</strong></Alert>
        }
        else if (this.state.alertShow === 2) {
    		loginAlert = <Alert bsStyle = "warning"><strong>You must enter a valid email address!</strong></Alert>
    	}
		else if (this.state.alertShow === 3) {
			loginAlert = <Alert bsStyle="danger"><strong>Invalid Login Credentials!</strong></Alert>;
		}
		else if (this.state.alertShow === 4) {
			loginAlert = <Alert bsStyle = "danger"><strong>Server Error! Please try again later</strong></Alert>
		}

        return (
            <div className="container-fluid">
                {loginAlert}
                  <div className = "col-md-4"></div>
                <Jumbotron className = "col-sm-4">
                  {/*<h1 id = "loginTitle" className = "w3-animate-top">HalfWay</h1>*/}
                {/*check out ref property*/}
                <img id = 'logo' src = {logo} alt = "HalfWay Logo" />
                <form onSubmit={(event) => this.authUser(event)} ref={(form) => { this.loginForm = form }}>
                    <FieldGroup
                        name="email"
                        label="Email"
                        type="text"
                        onChange={this.onChange}
                        placeholder="Enter username"
                    />
                    <FieldGroup
                        name="password"
                        label="Password"
                        type="password"
                        onChange={this.onChange}
                        placeholder="Enter password"
                    />
                    <Button id="forgot" href="/reset" style={{ margin: 5}}>Forgot Password</Button>
                    <Button className = "btn-primary" style={{ margin: 5}} type="submit" id="loginButton" disabled = {this.state.isLoading} >Log In</Button>
                </form>
                </Jumbotron>
                <div className = "col-md-4"></div>
                <div className = "col-lg-12">&copy; 3-Factor Authentication</div>
            </div>
        );
    }
}
