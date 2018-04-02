import React, { Component } from 'react';
import firebase from 'firebase';
import { app } from '../base';
import { Modal, Button, FormControl, FormGroup, HelpBlock, ControlLabel, Alert } from 'react-bootstrap';

// FieldGroup set-up pull directly from react boostrap
function FieldGroup({ id, label, help, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
  }

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.changePassword = this.changePassword.bind(this);

        this.state = {
            alertState: null,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            isLoading: false
        }
    }

    closeModal() {
        this.props.closeModal();
    }

    changePassword() {
        //console.log("changing password later...");
        this.setState({ isLoading: true });
        let self = this;
        //can't have any empty fields
        if (this.state.currentPassword === "" || this.state.newPassword === "" || this.state.confirmNewPassword === "") {
            this.setState({ 
                alertState: <Alert bsStyle="warning">One or more fields are empty!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        //both new passwords must match!
        if (this.state.newPassword !== this.state.confirmNewPassword) {
            this.setState({ 
                alertState: <Alert bsStyle="warning">New Password Fields Don't Match!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        //verify that new passwords match rules:
        // *7+ characters, *at least one capital letter *at least one number *at least one symbol
        // regex taken/modified from: https://dzone.com/articles/use-regex-test-password
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        if(!strongRegex.test(this.state.newPassword)) {
            this.setState({ 
                alertState: <Alert bsStyle="warning">Weak Password! Check above rules and try again.</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        //okay, now authenticate with current password and submit changes
        firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, this.state.currentPassword))
        .then(() => {
            console.log("authenticated! changing password...");

            app.auth().currentUser.updatePassword(this.state.newPassword)
            .then(() => {
                console.log("successfully updated password!");

                self.setState({ 
                    //alertState: <Alert bsStyle="success">Successfully Updated Password!</Alert>,
                    isLoading: false
                });
    
                /*window.setTimeout(() => {
                    this.setState({ alertState: null });
                }, 5000);*/

                self.props.showAlert("Changed Password Successfully!");
                self.props.closeModal();
            })
            .catch((err) => {
                console.log("error updating password!");
                console.log(err);

                this.setState({ 
                    alertState: <Alert bsStyle="danger">Error Updating Password!</Alert>,
                    isLoading: false
                });
    
                window.setTimeout(() => {
                    this.setState({ alertState: null });
                }, 5000);
            })
        })
        .catch((err) => {
            console.log("error authenticating!");
            console.log(err);
            this.setState({ 
                alertState: <Alert bsStyle="warning">Invalid Current Password!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
        });
    }

    render() {
        return (
            <Modal.Dialog>
                
                <Modal.Header>
                <Modal.Title>Change Password!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                {this.state.alertState}
                <form>
                    <p>Passwords must contain:
                        *A minimum of 7 characters
                        *At least one capital letter
                        *At least one number
                        *At least one symbol
                    </p>
                    <FieldGroup
                    id="formControlsCurrent"
                    type="password"
                    label="Current Password"
                    placeholder="Current Password"
                    onChange={(evt) => {this.setState({currentPassword: evt.target.value})}}
                    />
                    <FieldGroup
                    id="formControlsNew"
                    type="password"
                    label="New Password"
                    placeholder="New Password"
                    onChange={(evt) => {this.setState({newPassword: evt.target.value})}}
                    />
                    <FieldGroup
                    id="formControlsNewConfirm"
                    type="password"
                    label="Confirm New Password"
                    placeholder="Confirm New Password"
                    onChange={(evt) => {this.setState({confirmNewPassword: evt.target.value})}}
                    />
                </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.closeModal}>Close</Button>
                    <Button bsStyle="primary" onClick={this.changePassword} disabled={this.state.isLoading}>Change Password!</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}