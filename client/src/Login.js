import React, { Component } from 'react';
import { FormControl, FormGroup, ControlLabel, HelpBlock, Button, Alert } from 'react-bootstrap';

//import logo from './logo.svg';

import './Login.css';

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
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        //this.passwordChange = this.passwordChange.bind(this);
        //this.passwordSubmit = this.passwordSubmit.bind(this);
        this.state = {
            email: "",
            password: "",
            alertShow: 0,
            hashPassword: "",
        };
    }

    /*passwordChange(event) {
        const target = event.target;
        const value = target.value;
        console.log("hash:" + value);
        this.setState({'hashPassword': value});
    }*/

    /*passwordSubmit(event) {
        console.log("password: " + this.state.hashPassword);
        let obj = {
            "password": this.state.hashPassword
        }
        fetch('/api/hash', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
    }*/

    onChange(event) {
        //event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    onSubmit(event) {
        event.preventDefault();
        //regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.state.email === "" || this.state.password === "") {
        	this.setState({alertShow: 1});
        	window.setTimeout(() => {
        		this.setState({alertShow: 0});
        	}, 5000);
        }
        else if (!emailRegex.test(this.state.email)) {
        	this.setState({alertShow: 2});
        	window.setTimeout(() => {
        		this.setState({alertShow: 0});
        	}, 5000);
        }
        else {
        	let obj = {
        		"user": this.state.email,
        		"password": this.state.password
            }
            console.log(obj);
        	fetch('/api/login', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(obj)
			})
			.then((resp) => resp.json())
			.then(
				(data) => {
				    //alert(JSON.stringify(data));
					console.log(data);
					if (data.result === false) {
						this.setState({alertShow: 3});
						window.setTimeout(() => {
							this.setState({alertShow: 0});
						}, 5000);
					}
					else {
						this.setState({alertShow: 4});
						window.setTimeout(() => {
							this.setState({alertShow: 0});
					 	}, 5000);
						 this.props.setLoginState(true, data.name);
					}
				}
			);
		}
    }

    render() {
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
                <form>
                    <FieldGroup
                        name="email"
                        label="Email address"
                        type="email"
                        placeholder="Enter email"
                        onChange={this.onChange}
                    />
                    <FieldGroup
                        name="password"
                        label="Password" 
                        type="password"
                        placeholder="Enter password"
                        onChange={this.onChange}
                    />
                    <Button type="submit" onClick={this.onSubmit}>Submit</Button>
                </form>
                {/*<input type="text" onChange={this.passwordChange} name="submitPassword" />
                <Button type="submit" onClick={this.passwordSubmit}>Hash Password</Button>*/}
            </div>
        );
    }
}

export default Login;