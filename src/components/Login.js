import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { app } from '../base';
import { FormControl, FormGroup, ControlLabel, HelpBlock, Button, Alert } from 'react-bootstrap';
import logo from '../images/HWtrial2.png';

//import logo from './logo.svg';

import '../login.css';

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

class Login extends Component {
    constructor(props) {
        super(props);
        this.authUser = this.authUser.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            redirect: false,
			username: "",
            password: "",
            alertShow: 0
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
        //regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        // eslint-disable-next-line
        //let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //checks for empty fields
        if (this.state.username === "" || this.state.password === "") {
        	this.setState({alertShow: 1});
            //shows alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({alertShow: 0});
            }, 5000);
            console.log("You have one or more empty fields!");
        }
        //checks for valid email format
        /*else if (!emailRegex.test(this.state.email)) {
            this.setState({alertShow: 2});
            //show alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({alertShow: 0});
            }, 5000);
            console.log("You must enter a valid email address!");
        }*/
        else {
            const email = this.state.username + "@halfway.com";
            const password = this.state.password;

            app.auth().fetchProvidersForEmail(email)
            .then((providers) => {
                //tests whether account exists
                if (providers.length === 0) {
                    this.setState({alertShow: 2});
                    //show alert for 5 seconds
                    window.setTimeout(() => {
                        this.setState({alertShow: 0});
                    }, 5000);
                    console.log("This account does not exist!");
                } 
                //checks for valid password
                else if (providers.indexOf("password") === -1) {
                    this.setState({alertShow: 2});
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
                console.log("success!");
                //resets form, sets user, clears component state
                if (user && user.email) {
                    this.loginForm.reset();
                    this.props.setCurrentUser(user);
                    this.setState({
                        redirect: true,
                        username: "",
                        password: ""
                    });
                }
            })
            .catch((error) => {
                //console.log("Error!");
                console.log(error);
                this.setState({alertShow: 3});
                //showing alert for 5 seconds
                window.setTimeout(() => {
                    this.setState({alertShow: 0});
                }, 5000);
            });
		}
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
			loginAlert = <Alert bsStyle="danger"><strong>Invalid Login Credentials!</strong></Alert>;
		}
		else if (this.state.alertShow === 3) {
			loginAlert = <Alert bsStyle = "danger"><strong>Server Error! Please try again later</strong></Alert>
		}

        return (
            <div className="container w3-animate-opacity">
                {loginAlert}
                <div className = "jumbotron">
                  <img id = 'logo' src = {logo} alt = "HalfWay Logo" />
                  <h1 id = "title" className = "w3-animate-top">Log in to HalfWay!</h1>
                </div>
                {/*check out ref property*/}
                <form onSubmit={(event) => this.authUser(event)} ref={(form) => { this.loginForm = form }}>
                    <FieldGroup
                        name="username"
                        label="Username"
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
                    <Button className = "btn-primary" type="submit" id="loginButton">Log In!</Button>
                </form>
            </div>
        );
    }
}

export default Login;
