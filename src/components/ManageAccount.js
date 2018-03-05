import React, { Component } from 'react';
import { render } from 'react-dom';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Jumbotron, Button } from 'react-bootstrap';

function FieldGroup({ id, label, help, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
}

export class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.submitAccount = this.submitAccount.bind(this);

        this.state = {
            displayName: "",
            email: "",
            type: "Youth"
        }
    }

    onChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    submitAccount(event) {
        event.preventDefault();
        let info = {
            email: this.state.email,
            display: this.state.displayName,
            type: this.state.type
        }

        //console.log(info);
        let url = "https://us-central1-halfway-a067e.cloudfunctions.net/createAccount";
        //let url = "";
        let fetchData = {
            method: 'POST',
            body: info,
            headers: new Headers()
        }

        fetch(url, fetchData)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render() {
        return (<Jumbotron style={{backgroundColor: "white"}}>
                <h2>Create New Account</h2>
                <form onSubmit={this.submitAccount}>
                    <FieldGroup
                    id="formControlsDisplayName"
                    type="text"
                    label="Display Name"
                    placeholder="Enter Name"
                    name="displayName"
                    onChange={this.onChange}
                    />
                    <FieldGroup
                    id="formControlsEmail"
                    type="email"
                    label="Email Address"
                    placeholder="Enter email"
                    name="email"
                    onChange={this.onChange}
                    />
                    <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Select Account Type</ControlLabel>
                        <FormControl componentClass="select" onChange={this.onChange} name="type">
                            <option value="admin" >Administrator</option>
                            <option value="mentor">Mentor/Volunteer</option>
                            <option value="youth">Youth</option>
                        </FormControl>
                    </FormGroup>
                    <Button className = "btn-primary" type="submit">Create Account!</Button>
                </form>
            </Jumbotron>    
        );
    }
}

export class ChangeAccount extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);

        this.state = {
            email: "",
            accType: ""
        }
    }

    onChange(event) {
        //event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    render() {
        return (<p>Hello! I'm the ChangeAccount Component!</p>);
    }
}