import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { app } from '../base';
import { FormControl, FormGroup, ControlLabel, HelpBlock, Button, Alert } from 'react-bootstrap';

//import logo from './logo.svg';

//import './Login.css';

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
			email: "",
            password: "",
            alertShow: 0
        }
    }

    onChange(event) {
        //event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    authUser(event) {
        event.preventDefault();
        //regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.state.email === "" || this.state.password === "") {
        	this.setState({alertShow: 1});
        	window.setTimeout(() => {
        		this.setState({alertShow: 0});
            }, 5000);
            console.log("You have one or more empty fields!");
        }
        else if (!emailRegex.test(this.state.email)) {
            this.setState({alertShow: 2});
        	window.setTimeout(() => {
        		this.setState({alertShow: 0});
            }, 5000);
            console.log("You must enter a valid email address!");
        }
        else {
            //console.log("We'll authenticate later!");
            const email = this.state.email;
            const password = this.state.password;

            app.auth().fetchProvidersForEmail(email)
            .then((providers) => {
                if (providers.length === 0) {
                    this.setState({alertShow: 3});
                    window.setTimeout(() => {
                        this.setState({alertShow: 0});
                    }, 5000);
                    console.log("This account does not exist!");
                } else if (providers.indexOf("password") === -1) {
                    this.setState({alertShow: 3});
                    window.setTimeout(() => {
                        this.setState({alertShow: 0});
                    }, 5000);
                    console.log("invalid login credentials!");
                } else {
                    return app.auth().signInWithEmailAndPassword(email, password);
                }
            })
            .then((user) => {
                /*this.setState({alertShow: 4});
                window.setTimeout(() => {
                    this.setState({alertShow: 0});
                }, 5000);*/
                console.log("success!");
                if (user && user.email) {
                    this.loginForm.reset();
                    this.props.setCurrentUser(user);
                    this.setState({ 
                        redirect: true,
                        email: "",
                        password: ""
                    });
                }
                //return user.updateProfile({'displayName': "Jane Doe"});
            })
            .catch((error) => {
                console.log("Error!");
                console.log(error);
            })
		}
    }

    render() {
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
    		loginAlert = <Alert bsStyle = "warning"><strong>Please enter a valid email address.</strong></Alert>
    	}
		else if (this.state.alertShow === 3) {
			loginAlert = <Alert bsStyle="danger"><strong>Invalid Login Credentials!</strong></Alert>;
		}
		else if (this.state.alertShow === 4) {
			loginAlert = <Alert bsStyle = "success"><strong>Login Successful!</strong></Alert>
		}
		
        return (
            <div className="container">
                {loginAlert}
                <h2>Login to HalfWay!</h2>
                <form onSubmit={(event) => this.authUser(event)} ref={(form) => { this.loginForm = form }}>
                    <FieldGroup
                        name="email"
                        label="Email address"
                        type="email"
                        onChange={this.onChange}
                        placeholder="Enter email"
                    />
                    <FieldGroup
                        name="password"
                        label="Password" 
                        type="password"
                        onChange={this.onChange}
                        placeholder="Enter password"
                    />
                    <Button type="submit">Log In!</Button>
                </form>
                {/*<input type="text" onChange={this.passwordChange} name="submitPassword" />
                <Button type="submit" onClick={this.passwordSubmit}>Hash Password</Button>*/}
            </div>
        );
    }
}

export default Login;