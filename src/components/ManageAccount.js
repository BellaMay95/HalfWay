import React, { Component } from 'react';
//import { render } from 'react-dom';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Jumbotron, Button, Alert } from 'react-bootstrap';
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

export class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.submitAccount = this.submitAccount.bind(this);

        this.state = {
            displayName: "",
            userName: "",
            email: "",
            type: "Youth",
            formStatus: null,
            isLoading: false
        }
    }

    onChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    submitAccount(event) {
        this.setState({isLoading: true});
        event.preventDefault();
        let info = {
            "email": this.state.email,
            "username": this.state.userName,
            "display": this.state.displayName,
            "type": this.state.type
        }
        let url = "https://us-central1-halfway-a067e.cloudfunctions.net/app/createAccount";
        //let url = "http://localhost:5000/halfway-a067e/us-central1/app/createAccount";
        let fetchData = {
            'method': 'POST',
            'Content-Type': 'application/json',
            'body': JSON.stringify(info),
            'headers': new Headers()
        }

        //console.log(fetchData);

        fetch(url, fetchData)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            if (data.success) {
                this.setState({
                    formStatus: <Alert bsStyle = "success"><strong>Created Account!</strong></Alert>,
                    isLoading: false
                })
            } else {
                this.setState({
                    formStatus: <Alert bsStyle = "danger"><strong>Failed to Create Account! Check log for details!</strong></Alert>,
                    isLoading: false
                })
            }
            
            this.createAccountForm.reset();            
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                formStatus: <Alert bsStyle = "danger"><strong>Failed to Create Account! Check log for details!</strong></Alert>,
                isLoading: false
            })
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
        })
    }

    render() {
        return (<Jumbotron style={{backgroundColor: "white"}}>
                {this.state.formStatus}
                <h2>Create New Account</h2>
                <form onSubmit={this.submitAccount} ref={(form) => { this.createAccountForm = form }}>
                    <FieldGroup
                    id="formControlsUserName"
                    type="text"
                    label="Username"
                    placeholder="Enter Userame"
                    name="userName"
                    onChange={this.onChange}
                    />
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
                        <FormControl componentClass="select" onChange={this.onChange} name="type" defaultValue="youth">
                            <option value="admin" >Administrator</option>
                            <option value="mentor">Mentor/Volunteer</option>
                            <option value="youth">Youth</option>
                        </FormControl>
                    </FormGroup>
                    <Button className = "btn-primary" type="submit" disabled={this.state.isLoading}>Create Account!</Button>
                </form>
            </Jumbotron>    
        );
    }
}

export class ChangeAccount extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.submitChange = this.submitChange.bind(this);

        this.state = {
            userName: "",
            accType: "",
            isLoading: false,
            formStatus: null
        }
    }

    onChange(event) {
        //event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    submitChange(event) {
        event.preventDefault();
        let data = {
            username: this.state.userName,
            type: this.state.accType
        }

        var user = app.auth().currentUser;
        let username = user.email;
        let checkEmail = data.username + "@halfway.com";
        if (username === checkEmail) {
            console.log("You can't change your own account type, silly!");
            this.setState({
                formStatus: <Alert bsStyle = "danger"><strong>You can't change your own account type!</strong></Alert>,
                isLoading: false
            });
            this.changeAccountForm.reset();            
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
            return;
        }

        let url = "https://us-central1-halfway-a067e.cloudfunctions.net/app/changeAccount";
        //let url = "http://localhost:5000/halfway-a067e/us-central1/app/changeAccount";
        let fetchData = {
            'method': 'POST',
            'Content-Type': 'application/json',
            'body': JSON.stringify(data),
            'headers': new Headers()
        }

        fetch(url, fetchData)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            if (data.success) {
                this.setState({
                    formStatus: <Alert bsStyle = "success"><strong>Changed Account Type!</strong></Alert>,
                    isLoading: false
                });
            }
            else {
                this.setState({
                    formStatus: <Alert bsStyle = "danger"><strong>Failed to Change Account Type! Check log for details!</strong></Alert>,
                    isLoading: false
                });
            }
            this.changeAccountForm.reset();            
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                formStatus: <Alert bsStyle = "danger"><strong>Failed to Change Account Type! Check log for details!</strong></Alert>,
                isLoading: false
            })
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
        })
    }

    render() {
        return (<Jumbotron style={{backgroundColor: "white"}}>
        {this.state.formStatus}
        <h2>Change Account Type</h2>
        <form onSubmit={this.submitChange} ref={(form) => { this.changeAccountForm = form }}>
            <FieldGroup
                id="formControlsUserName"
                type="text"
                label="Username"
                placeholder="Enter Userame"
                name="userName"
                onChange={this.onChange}
            />
            <FormGroup controlId="formControlsSelect">
                <ControlLabel>Select New Account Type</ControlLabel>
                <FormControl componentClass="select" onChange={this.onChange} name="accType" defaultValue="mentor">
                    <option value="admin" >Administrator</option>
                    <option value="mentor">Mentor/Volunteer</option>
                    <option value="youth">Youth</option>
                </FormControl>
            </FormGroup>
            <Button className = "btn-primary" type="submit" disabled={this.state.isLoading}>Create Account!</Button>
        </form>
    </Jumbotron>   
    
        );
    }
}