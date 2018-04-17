import React, { Component } from 'react';
//import { render } from 'react-dom';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Jumbotron, Button, Alert, Modal } from 'react-bootstrap';
import { app } from '../base';
import firebase from 'firebase';

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
            type: "youth",
            adminPassword: "",
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

        //regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        //eslint-disable-next-line
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        

        if (this.state.email === "" || this.state.displayName === "" || this.state.adminPassword === "" || this.state.type === "") {
            this.setState({
                formStatus: <Alert bsStyle = "warning"><strong>One or more fields are empty. Please try again.</strong></Alert>, 
                isLoading: false 
            });
            //shows alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
            console.log("You have one or more empty fields!");
            return;
        } else if (!emailRegex.test(this.state.email)) {
            console.log(this.state.email);
            this.setState({
                formStatus: <Alert bsStyle = "warning"><strong>You must enter a valid email address.</strong></Alert>, 
                isLoading: false 
            });
            //show alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
            console.log("You must enter a valid email address!");
            return;
        } else {
            firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, this.state.adminPassword))
            .then(() => {
                let info = {
                    "email": this.state.email,
                    "display": this.state.displayName,
                    "type": this.state.type
                }

                var addAccount = app.functions().httpsCallable('createAccount');
                addAccount(info)
                .then((data) => {
                    console.log(data);
                    this.setState({
                        formStatus: <Alert bsStyle = "success"><strong>{data.data}</strong></Alert>,
                        isLoading: false
                    })
                    this.createAccountForm.reset();
                    window.setTimeout(() => {
                        this.setState({formStatus: null});
                    }, 5000);
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        formStatus: <Alert bsStyle = "danger"><strong>{err.message}</strong></Alert>,
                        isLoading: false
                    })
                    window.setTimeout(() => {
                        this.setState({formStatus: null});
                    }, 5000);
                });
            })
            .catch((err) => {
                console.log("Invalid authentication!");
                console.log(err);
                this.setState({
                    formStatus: <Alert bsStyle="danger"><strong>Invalid Administrator Password.</strong></Alert>,
                    isLoading: false
                })
            });
        }
    }

    render() {
        return (<Jumbotron style={{backgroundColor: "white"}}>
                {this.state.formStatus}
                <h2>Create New Account</h2>
                <form onSubmit={this.submitAccount} ref={(form) => { this.createAccountForm = form }}>
                    <FieldGroup
                    id="createAccountDisplayName"
                    type="text"
                    label="Display Name"
                    placeholder="Enter Name"
                    name="displayName"
                    onChange={this.onChange}
                    />
                    <FieldGroup
                    id="createAccountEmail"
                    type="email"
                    label="Email Address"
                    placeholder="Enter email"
                    name="email"
                    onChange={this.onChange}
                    />
                    <FormGroup controlId="createAccountSelect">
                        <ControlLabel>Select Account Type</ControlLabel>
                        <FormControl componentClass="select" onChange={this.onChange} name="type" defaultValue="youth">
                            <option value="admin" >Administrator</option>
                            <option value="mentor">Mentor/Volunteer</option>
                            <option value="youth">Youth</option>
                        </FormControl>
                    </FormGroup>
                    <FieldGroup
                    id="createAccountPassword"
                    type="password"
                    label="Admin Password"
                    placeholder="Enter password"
                    name="adminPassword"
                    onChange={this.onChange}
                    />
                    <Button className = "btn-primary" type="submit" disabled={this.state.isLoading} id="crAccSubmit">Create Account!</Button>
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
            email: "",
            accType: "mentor",
            adminPassword: "",
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
        this.setState({ isLoading: true });

        //regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        //eslint-disable-next-line
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (this.state.email === "" || this.state.adminPassword === "" || this.state.accType === "") {
            this.setState({
                formStatus: <Alert bsStyle = "warning"><strong>One or more fields are empty. Please try again.</strong></Alert>, 
                isLoading: false 
            });
            //shows alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
            console.log("You have one or more empty fields!");
            return;
        } else if (!emailRegex.test(this.state.email)) {
            console.log(this.state.email);
            this.setState({
                formStatus: <Alert bsStyle = "warning"><strong>You must enter a valid email address.</strong></Alert>, 
                isLoading: false 
            });
            //show alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
            console.log("You must enter a valid email address!");
            return;
        }

        let data = {
            email: this.state.email,
            type: this.state.accType
        }

        var user = app.auth().currentUser;
        let ownEmail = user.email; //logged in user
        let email = data.email; //email of account to be changed
        if (ownEmail === email) {
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

        firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, this.state.adminPassword))
        .then(() => {
            var changeAccount = app.functions().httpsCallable('changeAccount');
            changeAccount(data)
            .then((data) => {
                console.log(data);
                this.setState({
                    formStatus: <Alert bsStyle = "success"><strong>{data.data}</strong></Alert>,
                    isLoading: false
                });
                this.changeAccountForm.reset();    
                window.setTimeout(() => {
                    this.setState({formStatus: null});
                }, 5000);
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    formStatus: <Alert bsStyle = "danger"><strong>{err.message}</strong></Alert>,
                    isLoading: false
                });
                window.setTimeout(() => {
                    this.setState({formStatus: null});
                }, 5000);
            })
        })
        .catch((err) => {
            console.log("Invalid authentication!");
            console.log(err);
            this.setState({
                formStatus: <Alert bsStyle="danger"><strong>Invalid Administrator Password.</strong></Alert>,
                isLoading: false
            });
        });
    }

    render() {
        return (<Jumbotron style={{backgroundColor: "white"}}>
        {this.state.formStatus}
        <h2>Change Account Type</h2>
        <form onSubmit={this.submitChange} ref={(form) => { this.changeAccountForm = form }}>
            <FieldGroup
                id="changeAccountEmail"
                type="text"
                label="Email"
                placeholder="Enter Email"
                name="email"
                onChange={this.onChange}
            />
            <FormGroup controlId="changeAccountSelect">
                <ControlLabel>Select New Account Type</ControlLabel>
                <FormControl componentClass="select" onChange={this.onChange} name="accType" defaultValue="mentor">
                    <option value="admin" >Administrator</option>
                    <option value="mentor">Mentor/Volunteer</option>
                    <option value="youth">Youth</option>
                </FormControl>
            </FormGroup>
            <FieldGroup
                id="changeAccountPassword"
                type="password"
                label="Admin Password"
                placeholder="Enter password"
                name="adminPassword"
                onChange={this.onChange}
            />
            <Button className = "btn-primary" type="submit" disabled={this.state.isLoading} id="chAccSubmit">Change Account Type!</Button>
        </form>
    </Jumbotron>   
    
        );
    }
}

export class DeleteAccount extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.validateDelete = this.validateDelete.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);

        this.state = {
            email: "",
            adminPassword: "",
            formStatus: null,
            isLoading: false,
            confirmModal: null
        }
    }

    onChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    validateDelete(event) {
        //alert("An account cannot be recovered once deleted. Deleting an account does not remove posts or comments by that user; it simply revokes their access to the site permanently. Are you sure you wish to proceed?");
        this.setState({isLoading: true});

        event.preventDefault();

        //regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        //eslint-disable-next-line
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        

        if (this.state.email === "" || this.state.adminPassword === "") {
            this.setState({
                formStatus: <Alert bsStyle = "warning"><strong>One or more fields are empty. Please try again.</strong></Alert>, 
                isLoading: false 
            });
            //shows alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
            console.log("You have one or more empty fields!");
            return;
        } else if (!emailRegex.test(this.state.email)) {
            this.setState({
                formStatus: <Alert bsStyle = "warning"><strong>You must enter a valid email address.</strong></Alert>, 
                isLoading: false 
            });
            //show alert for 5 seconds
            window.setTimeout(() => {
        		this.setState({formStatus: null});
            }, 5000);
            console.log("You must enter a valid email address!");
            return;
        } else {
            this.setState({
                confirmModal: true
            });
        }
    }

    deleteAccount(event) {
        this.setState({ confirmModal: false });

        firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, this.state.adminPassword))
        .then(() => {
            let info = {
                "email": this.state.email
            }

            var deleteAccount = app.functions().httpsCallable('deleteAccount');
            deleteAccount(info)
            .then((data) => {
                console.log(data);
                this.setState({
                    formStatus: <Alert bsStyle = "success"><strong>{data.data}</strong></Alert>,
                    isLoading: false
                })
                this.deleteAccountForm.reset();
                      
                window.setTimeout(() => {
                    this.setState({formStatus: null});
                }, 5000);
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    formStatus: <Alert bsStyle = "danger"><strong>{err.message}</strong></Alert>,
                    isLoading: false
                })
                window.setTimeout(() => {
                    this.setState({formStatus: null});
                }, 5000);
            })
        })
        .catch((err) => {
            console.log("Invalid authentication!");
            console.log(err);
            this.setState({
                formStatus: <Alert bsStyle="danger"><strong>Invalid Administrator Password.</strong></Alert>,
                isLoading: false
            })
        });
    }

    render() {
        return (<Jumbotron style={{backgroundColor: "white"}}>
        {this.state.formStatus}
        <h2>Delete Account</h2>
        <form onSubmit={this.validateDelete} ref={(form) => { this.deleteAccountForm = form }}>
            <FieldGroup
                id="deleteAccountEmail"
                type="text"
                label="Email"
                placeholder="Enter Email"
                name="email"
                onChange={this.onChange}
            />
            <FieldGroup
                id="deleteAccountPassword"
                type="password"
                label="Admin Password"
                placeholder="Enter password"
                name="adminPassword"
                onChange={this.onChange}
            />
            <Button className = "btn-primary" type="submit" disabled={this.state.isLoading} id="delAccSubmit">Delete Account!</Button>
        </form>

        {this.state.confirmModal ? <div className="static-modal">
                    <Modal.Dialog style={{ overflow: 'auto' }}>
                        <Modal.Body>Are you sure you wish to delete this account?
                                    An account cannot be recovered once deleted.
                                    Deleting an account does not remove posts or comments associated with the account.
                        </Modal.Body>
    
                        <Modal.Footer>
                            <Button id="confirmClose" onClick={() => {this.setState({confirmModal: false, isLoading: false})}}>Close</Button>
                            <Button bsStyle="danger" onClick={this.deleteAccount}>Delete Account</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div> : null }
    </Jumbotron>   
    
        );
    }
}