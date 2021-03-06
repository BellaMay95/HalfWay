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
            oldemail: "",
            email: "",
            avatar: "",
            profileName: "",
            confirmPassword: "",
            isLoading: false,
            isUploading: false,
            alertState: null,
            progress: 0,
            type: this.props.type ? this.props.type : "youth", //if no type sent, assume it's a youth account
            storageRef: app.storage().ref('userAvatars'), //only for the uploader element,
            filename: ""
        }
    }

    componentWillMount() {
        let user = app.auth().currentUser;

        this.setState({
            uid: user.uid,
            avatar: user.photoURL ? user.photoURL : defaultProfilePic,
            email: user.email ? user.email : "",
            oldemail: user.email ? user.email : "",
            profileName: user.displayName ? user.displayName : ""
        })
    }

    editProfile() {
        this.setState({isLoading: true});

        let user = app.auth().currentUser;

        //see if the avatar changed
        let avatarChange = false;
        if (!user.photoURL && this.state.avatar === defaultProfilePic) {
            console.log("no avatar before & no avatar now");
            avatarChange = false;
        }
        else if (user.photoURL === this.state.avatar) {
            console.log("there is an avatar and it hasn't changed");
            avatarChange = false;
        }
        else if (user.photoURL !== this.state.avatar) {
            console.log("avatar's changed");
            avatarChange = true;
        }
        else {
            console.log("this shouldn't ever be reached...but if so just pretend avatar hasn't changed");
            avatarChange = false;
        }


        //set back to old values if any fields are empty
        if (this.state.email === "") {
            this.setState({ email: this.props.email });
        } if (this.state.profileName === "") {
            this.setState({ profileName: user.displayName });
        }

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

        //user must enter password to approve changes
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
        if (this.state.email === this.props.email && !avatarChange && this.state.profileName === user.displayName) {
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

    savePermProfile(avatarChange) {
        let user = app.auth().currentUser;

        let updateError = [];
        console.log("ready to update profile");

        //empty promise exists to start the promise chain since I'm not sure which fields are changed yet
        return new Promise(function(resolve, reject) {
            resolve("dummy promise");
        })
        .then(() => {
            //update email if it's been changed
            if (this.state.email !== user.email) {
                user.updateEmail(this.state.email)
                .catch((err) => {
                    console.log("error updating email!");
                    console.log(err);
                    updateError.push("email");
                })
            }
        })
        .then(() => {
            //update display name if it's been changed
            if (this.state.profileName !== user.displayName) {
                user.updateProfile({
                    displayName: this.state.profileName
                })
                .catch((err) => {
                    console.log("error updating profile name!");
                    console.log(err);
                    updateError.push("profile name");
                })
            }
        })
        .then(() => {
            //update avatar if it's been changed
            if(avatarChange) {
                let oldUrl = user.photoURL;
                console.log("old url: " + oldUrl);
                if (oldUrl) {
                    let transEmail = user.email.replace("@", '%40');
                    let index1 = oldUrl.indexOf(transEmail);
                    //let index1 = oldUrl.indexOf(user.email);
                    let index2 = oldUrl.indexOf("?");
                    let oldRef = oldUrl.substring(index1, index2);
                    oldRef = oldRef.replace('%40', '@');
                    console.log("index1: " + index1 + "; index2: " + index2 + "; oldRef: " + oldRef)
                    this.state.storageRef.child(oldRef).delete()
                    .then(() => {
                        console.log("deleted the old avatar")
                        if(this.state.avatar !== defaultProfilePic) {
                            this.state.storageRef.child(this.state.filename).putString(this.state.avatar, 'data_url')
                            .then((snapshot) => {
                                console.log("we're done!")
                                //console.log("finished uploading with url..." + snapshot.downloadURL)
                            })
                            .catch((err) => {
                                console.log("error uploading new file!")
                                console.log(err);
                                updateError.push("avatar");
                            })
                        }
                    })
                    .then((snapshot) => {
                        console.log("got new url")
                        user.updateProfile({
                            photoURL: snapshot && snapshot.downloadURL ? snapshot.downloadURL : null
                        })
                        .catch((err) => {
                            console.log("error updating avatar!");
                            console.log(err);
                            updateError.push("avatar");
                        })
                    })
                    .catch((err) => {
                        console.log("error deleting previous file!");
                        console.log(err);
                        updateError.push("avatar");
                    })
                } else {
                    console.log("no old url!");
                    console.log(this.state.filename);
                    console.log(this.state.avatar);
                    this.state.storageRef.child(this.state.filename).putString(this.state.avatar, 'data_url')
                    .then((snapshot) => {
                        console.log("uploaded file with url: " + snapshot.downloadURL);
                        user.updateProfile({
                            photoURL: snapshot.downloadURL
                        })
                        .catch((err) => {
                            console.log("error updating avatar!");
                            console.log(err);
                            updateError.push("avatar");
                        })
                    })
                    .catch((err) => {
                        console.log("error uploading new file!")
                        console.log(err);
                        updateError.push("avatar");
                    })
                }
            }
        })
        .then(() => {
            console.log("end of promise chain, then");
            console.log(updateError)
            if (updateError.length === 0) {
                console.log("no errors here!");
                this.setState({ isLoading: false });
                window.setTimeout(() => {
                    this.props.showAlert("Profile Edited Successfully!", "success");
                    this.props.closeModal();
                }, 500)
            } else {
                let message = "Error updating ";
                for (let i=0; i < updateError.length; i++) {
                    message += ", ";
                    if (i === (updateError.length - 2)) {
                        message += "and ";
                    }
                    message += updateError[i];
                }
                message += "!";
                this.setState({ 
                    alertState: <Alert bsStyle="danger">{message}</Alert>,
                    isLoading: false 
                });
            }
        })
        .catch((err) => {
            console.log("an empty promise can't possibly cause problems!");
            console.log(err);
        })
    }

    savePendingProfile(avatarChange) {
        let self = this;
        console.log(this.state.avatar)
        console.log(this.state.avatar === defaultProfilePic);
        console.log(avatarChange);

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
            }
            userdata.status = "pending";
            userdata.currname = this.state.oldemail;
            let user = app.auth().currentUser;
            if (this.state.profileName !== user.displayName) {
                userdata['profileName'] = this.state.profileName;
                newComment += "profile name : ";
            } if (avatarChange && (this.state.avatar === defaultProfilePic)) {
                //avatar was removed
                userdata['oldavatar'] = user.photoURL;
                userdata['avatar'] = "removed";
                userdata['filename'] = this.state.filename;
                newComment += "avatar : "
            } if (avatarChange && (this.state.avatar !== defaultProfilePic)) {
                //avatar actually changed
                userdata['oldavatar'] = user.photoURL;
                userdata['avatar'] = this.state.avatar;
                userdata['filename'] = this.state.filename;
                newComment += "avatar : ";
            }

            userdata.comments.push(newComment + "Changes Awaiting Approval. Check back soon!");
    
            console.log(userdata);
    
            app.database().ref('pendingProfiles/' + this.state.uid).update(userdata)
            .then(() => {
                if (this.state.email !== user.email) {
                    user.updateEmail(this.state.email)
                    .catch((err) => {
                        console.log("Error updating email!");
                        console.log(err);

                        this.setState({ 
                            alertState: <Alert bsStyle="danger">Error Updating Email!</Alert>,
                            isLoading: false
                        });
            
                        window.setTimeout(() => {
                            this.setState({ alertState: null });
                        }, 5000);
                    })
                }
            })
            .then(() => {
                this.setState({ isLoading: false });
                self.props.showAlert("Profile Changes Successfully Submitted for Review!");
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
            console.log(image);
            self.setState({
                filename: this.state.email + "." + image.name.split('.')[1],
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
                <Modal.Dialog style={{ overflow: 'auto' }}>
                    <Modal.Header>
                        <Modal.Title>Edit Profile Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.alertState}
                        <Grid fluid={true} style={{backgroundColor: 'white'}} >
                            <Row>
                                <Col xs={12} sm={4} style={{margin: 0}}>
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
                                        id="formControlsEmail"
                                        type="email"
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
                        <Button id="closeModal" onClick={this.closeModal}>Close</Button>
                        <Button id="submitProfile" bsStyle="primary" onClick={this.editProfile} disabled={this.state.isLoading}>Edit Profile!</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}