import React, { Component } from 'react';
import { app } from '../base';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Alert } from 'react-bootstrap';
import defaultProfilePic from '../images/defaultProfile.jpg';

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

export default class EditProfile extends Component {
    constructor() {
        super();
        this.editProfile = this.editProfile.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
        this.state = {
            alertState: null,
            username: "",
            email: "",
            avatar: "",
            profileName: ""
        }
    }

    componentWillMount() {
        let user = app.auth().currentUser;

        this.setState({
            username: user.email.substr(0, user.email.indexOf('@')),
            email: this.props.email,
            avatar: user.photoURL ? user.photoURL : defaultProfilePic,
            profileName: user.displayName
        });
    }

    editProfile() {
        console.log("we'll edit this stuff later!");
    }

    closeModal() {
        this.props.closeModal();
    }

    render() {
        return (
            <div className="static-modal">
                <Modal.Dialog>
                    {this.state.alertState}
                    <Modal.Header>
                        <Modal.Title>Edit Profile Details</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <form>
                        <FieldGroup
                        id="formControlsUsername"
                        type="text"
                        label="Username"
                        placeholder={this.state.username}
                        onChange={(evt) => {this.setState({username: evt.target.value})}}
                        />
                        <FieldGroup
                        id="formControlsEmail"
                        type="text"
                        label="Email"
                        placeholder={this.state.email}
                        onChange={(evt) => {this.setState({email: evt.target.value})}}
                        />
                        <FieldGroup
                        id="formControlsUsername"
                        type="text"
                        label="Display Name"
                        placeholder={this.state.profileName}
                        onChange={(evt) => {this.setState({profileName: evt.target.value})}}
                        />
                    </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.closeModal}>Close</Button>
                        <Button bsStyle="primary" onClick={this.editProfile}>Edit Profile!</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}