import React, { Component } from 'react';
import { FormControl, FormGroup, ControlLabel, HelpBlock, Button } from 'react-bootstrap';

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
        this.state = {
            email: '',
            password: ''
        };
    }

    onChange(event) {
        //event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.state.email === "hello@google.com" && this.state.password === "password") {
            this.props.setLoginState(true, this.state.email);
        }
        else {
            console.log("login failed");
        }
    }

    render() {
        return (
            <div className="container">
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
            </div>
        );
    }
}

export default Login;