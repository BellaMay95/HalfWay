import React, { Component } from 'react';
import { FormGroup, ControlLabel, HelpBlock, FormControl, Button, Navbar, Alert } from 'react-bootstrap';
import logo from '../images/HWtrial2.png';
import { app } from '../base';

function FieldGroup({ id, label, help, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
  }

export default class ResetPassword extends Component {
    constructor() {
        super();

        this.reset = this.reset.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            email: "",
            isLoading: false,
            alertState: null
        }
    }

    //updates state variables when form fields change
    onChange(event) {
        //console.log("calling change!");
        //event.preventDefault();
        const target = event.target;
        const value = target.value;
        this.setState({email: value});
    }

    reset() {
        //console.log("resetting password later!");
        //console.log("we got account: " + this.state.email);
        this.setState({
            isLoading: true
        });

        //validate field not empty
        if (this.state.email === "") {
            this.setState({ 
                alertState: <Alert bsStyle="warning">You must enter your email!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        //validate valid email format
        //regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        // eslint-disable-next-line
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        //email has to be in email format
        if (!emailRegex.test(this.state.email)) {
            this.setState({ 
                alertState: <Alert bsStyle="warning">Invalid email address!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        //send email to account
        //console.log("sending reset email in a bit!");
        app.auth().sendPasswordResetEmail(this.state.email)
        .then(() => {
            // Email sent.
            console.log("successfully sent email!")
            this.setState({ 
                alertState: <Alert bsStyle="success">Email Sent! Check your Inbox!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        })
        .catch((err) => {
            console.log("error sending reset email -- but don't tell that to the client!");
            this.setState({ 
                alertState: <Alert bsStyle="success">Email Sent! Check your Inbox!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        });
    }

    render() {
        return(
            <div className="container w3-animate-opacity">
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/" style={{padding: 3}}>< img height = '55px' width = '55px' src = {logo} alt = "HalfWay logo" /></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                </Navbar>
                {this.state.alertState}
                <h1>Reset Password</h1>
                <form>
                    <FieldGroup
                        id="formControlsEmail"
                        type="email"
                        label="Enter Email"
                        placeholder="Enter email"
                        onChange={this.onChange}
                    />
                    <Button bsStyle="primary" onClick={this.reset} disabled={this.state.isLoading}>Submit</Button>
                </form>
            </div>
        );
    }
}