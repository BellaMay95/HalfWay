import React, { Component } from 'react';
import firebase from 'firebase';
import { app } from '../base';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Grid, Row, Col, Image } from 'react-bootstrap';
import defaultProfilePic from '../images/defaultProfile.jpg';

import FileUploader from 'react-firebase-file-uploader';

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
    constructor(props) {
        super(props);
        this.editProfile = this.editProfile.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.savePendingProfile = this.savePendingProfile.bind(this);
        this.savePermProfile = this.savePermProfile.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.removeAvatar = this.removeAvatar.bind(this);
        
        this.state = {
            uid: "",
            username: "",
            oldname: "",
            email: this.props.email ? this.props.email : "",
            avatar: "",
            profileName: "",
            confirmPassword: "",
            isLoading: false,
            isUploading: false,
            alertState: null,
            progress: 0,
            type: "",
            storageRef: app.storage().ref()
        }
    }

    componentWillMount() {
        let user = app.auth().currentUser;
        app.database().ref('users/' + user.uid).once('value')
        .then((snapshot) => {
            this.setState({
                uid: user.uid,
                avatar: snapshot.val().avatar ? snapshot.val().avatar : defaultProfilePic,
                username: user.email.substr(0, user.email.indexOf('@')) ? user.email.substr(0, user.email.indexOf('@')) : "", 
                oldname: user.email.substr(0, user.email.indexOf('@')) ? user.email.substr(0, user.email.indexOf('@')) : "",
                profileName: user.displayName ? user.displayName : "",
                type: snapshot.val().type
            });

            console.log(this.state);
        })
        .catch((err) => {
            console.log("failed to set initial data!");
            console.log(err);
        })
    }

    editProfile() {
        this.setState({isLoading: true});

        let avatarChange = () => {
            return this.avatarChanged
        };

        if (this.state.confirmPassword === "") {
            this.setState({ 
                alertState: <Alert bsStyle="warning">Enter your current password!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        //check to see if there were any changes in the profile
        let userEmail = this.state.username + "@halfway.com";
        let user = app.auth().currentUser;
        if (userEmail === user.email && this.state.email === this.props.email && !avatarChange && this.state.profileName === user.displayName) {
            //console.log("no changes!");
            this.setState({ 
                alertState: <Alert bsStyle="warning">No changes detected!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, this.state.confirmPassword))
        .then(() => {
            //If account type is "youth" store in pending changes
            if (this.state.type === "youth") {
                this.savePendingProfile(avatarChange);
            }
            else { //otherwise go ahead and store changes in auth/database
                this.savePermProfile(avatarChange);
            }
        })
        .catch(() => {
            console.log("Invalid current password!");
            this.setState({ 
                alertState: <Alert bsStyle="danger">Invalid Password!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        })
    }

    avatarChanged() {
        app.database().ref('users/' + this.state.uid).once('value')
        .then((snapshot) => {
            //let change = true;
            if (!snapshot.val().avatar && (this.state.avatar === defaultProfilePic)) {
                console.log("no avatar exists");
                return false;
            }
            else if (this.state.avatar === snapshot.val().avatar) {
                console.log("avatar hasn't changed");
                return false;
            } else if (this.state.avatar !== snapshot.val().avatar) {
                console.log("avatar changed!");
                return true;
            }
        })
        .catch((err) => {
            console.log("error checking for avatar change! Assume it didn't change.");
            return false;
        });
    }

    savePermProfile(avatarChange) {
        let user = app.auth().currentUser;
        let self = this;

        //update profile name
        user.updateProfile({
            displayName: this.state.profileName,
        })
        .then(() => { //update profile pic
            if (avatarChange) {
                app.database().ref('users/' + this.state.uid).update({
                    avatar: this.state.avatar !== defaultProfilePic ? this.state.avatar : null
                })
                .catch((err) => {
                    console.log("error updating avatar!");
                    console.log(err);
                    this.setState({ alertState: <Alert bsStyle="danger">Error Updating Avatar!</Alert>});

                    window.setTimeout(() => {
                        this.setState({ alertState: null });
                    }, 5000);
                })
            }
        })
        .then(() => { //update username
            let email = this.state.username + "@halfway.com";
            if (email !== user.email && this.state.username !== "") {
                console.log("updating username!");
                user.updateEmail(email)
                .catch((err) => {
                    console.log("error updating username!");
                    console.log(err);
                    this.setState({ alertState: <Alert bsStyle="danger">Error Updating Username!</Alert>});

                    window.setTimeout(() => {
                        this.setState({ alertState: null });
                    }, 5000);
                })
            }
        })
        .then(() => { //update email in database
            if(this.state.email !== this.props.email && this.state.email !== "") {
                app.database().ref('users/' + this.state.uid).update({
                    email: this.state.email
                })
                .catch((err) => {
                    console.log("error updating email!");
                    console.log(err);

                    this.setState({ alertState: <Alert bsStyle="danger">Error Updating Email!</Alert>});

                    window.setTimeout(() => {
                        this.setState({ alertState: null });
                    }, 5000);
                })
            }
        })
        .then(() => {
            this.setState({ isLoading: false });
            self.props.showAlert("Saved Profile Changes Successfully!");
            this.closeModal();
        })
        .catch((error) => {
            console.log("error updating profile name or avatar!");
            console.log(error);

            this.setState({ 
                alertState: <Alert bsStyle="danger">Error Updating Account Details!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
        });
    }

    savePendingProfile(avatarChange) {
        let self = this;

        app.database().ref('pendingProfiles/' + this.state.uid).once('value')
        .then((snapshot) => {
            let userdata = {};
            let date = new Date().toLocaleString();
            let newComment = date + ": Updated: "
            if (snapshot.val()) {
                userdata = snapshot.val();
                console.log(userdata);
                
            }
            else {
                userdata.comments = [];
                //userdata.comments.push(date + ": Changes Awaiting Approval. Check back soon!");
            }
            userdata.status = "pending";
            userdata.currname = this.state.oldname;
            let user = app.auth().currentUser;
            if ((this.state.username + "@halfway.com") !== user.email) {
                userdata['username'] = this.state.username;
                newComment += "username : "
            } if (this.state.email !== this.props.email) {
                userdata['email'] = this.state.email;
                newComment += "email : "
            } if (this.state.profileName !== user.displayName) {
                userdata['profileName'] = this.state.profileName;
                newComment += "profile name : ";
            } if (avatarChange && this.state.avatar === defaultProfilePic) {
                //avatar was removed
                userdata['avatar'] = "removed";
                newComment += "avatar : "
            } if (avatarChange && this.state.avatar !== defaultProfilePic) {
                //avatar actually changed
                userdata['avatar'] = this.state.avatar;
                newComment += "avatar : ";
            }

            userdata.comments.push(newComment + "Changes Awaiting Approval. Check back soon!");
    
            console.log(userdata);
    
            app.database().ref('pendingProfiles/' + this.state.uid).update(userdata)
            .then(() => {
                this.setState({ isLoading: false });
                self.props.showAlert("Saved Profile Changes Successfully!");
                this.closeModal();
            })
            .catch((err) => {
                this.setState({ 
                    alertState: <Alert bsStyle="danger">Failed to submit changes!</Alert>,
                    isLoading: false
                });
    
                window.setTimeout(() => {
                    this.setState({ alertState: null });
                }, 5000);
            });
        })
        .catch((err) => {
            console.log("error retrieving existing changes...");
            console.log(err);

            this.setState({ 
                alertState: <Alert bsStyle="danger">Failed to submit changes!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
        })
    }

    onChangeImage(event) {
        console.log("getting image blob!");
        const image = event.target.files[0];

        let reader = new FileReader();
        let self = this;

        reader.onloadend = () => {
            self.setState({
                //avatarImg: image,
                avatar: reader.result
            });
        }

        reader.readAsDataURL(image);
    }

    removeAvatar() {
        console.log("ready to remove photo...");
        this.setState({
            avatar: defaultProfilePic
        })
    }

    closeModal() {
        this.props.closeModal();
    }

    render() {
        return (
            <div className="static-modal">
                <Modal.Dialog style={{ overflow: 'auto' }}g>
                    <Modal.Header>
                        <Modal.Title>Edit Profile Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.alertState}
                        <Grid fluid={true}>
                            <Row>
                                <Col xs={12} sm={4}>
                                    <ControlLabel>User Avatar</ControlLabel>
                                    <Image src={this.state.avatar} responsive rounded />
                                    <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor'}}>
                                        Choose Avatar
                                        <FileUploader
                                        accept="image/*"
                                        storageRef={this.state.storageRef}
                                        onChange={this.onChangeImage}
                                        hidden
                                        />
                                        <Button bsStyle="danger" disabled={this.state.avatar === defaultProfilePic} onClick={this.removeAvatar}>Remove Avatar</Button>
                                    </label>
                                        
                                </Col>
                                <Col xs={12} sm={8}>
                                    <form>
                                        <FieldGroup
                                        id="formControlsUsername"
                                        type="text"
                                        label="Username"
                                        value={this.state.username}
                                        onChange={(evt) => {this.setState({username: evt.target.value})}}
                                        />
                                        <FieldGroup
                                        id="formControlsEmail"
                                        type="text"
                                        label="Email"
                                        value={this.state.email}
                                        onChange={(evt) => {this.setState({email: evt.target.value})}}
                                        />
                                        <FieldGroup
                                        id="formControlsProfileName"
                                        type="text"
                                        label="Display Name"
                                        value={this.state.profileName}
                                        onChange={(evt) => {this.setState({profileName: evt.target.value})}}
                                        />
                                    </form>
                                </Col>
                            </Row>
                            <Row>
                                <FieldGroup
                                id="formControlsConfirmPassword"
                                type="password"
                                label="Confirm Password"
                                onChange={(evt) => {this.setState({confirmPassword: evt.target.value})}}
                                />
                            </Row>
                        </Grid>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.closeModal}>Close</Button>
                        <Button bsStyle="primary" onClick={this.editProfile} disabled={this.state.isLoading}>Edit Profile!</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}