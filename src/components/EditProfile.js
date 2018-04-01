import React, { Component } from 'react';
import firebase from 'firebase';
import { app } from '../base';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Grid, Row, Col, Image, ProgressBar } from 'react-bootstrap';
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
        this.handleUploadStart = this.handleUploadStart.bind(this);
        this.handleUploadError = this.handleUploadError.bind(this);
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
        this.handleProgress = this.handleProgress.bind(this);
        this.removeAvatar = this.removeAvatar.bind(this);
        
        this.state = {
            uid: "",
            username: "",
            email: this.props.email ? this.props.email : "",
            avatar: "",
            profileName: "",
            confirmPassword: "",
            isLoading: false,
            isUploading: false,
            alertState: null,
            progress: 0,
            avatarRef: null,
            newAvatarRef: null,
            avatarImg: null
        }
    }

    componentWillMount() {
        let user = app.auth().currentUser;
        app.database().ref('users/' + user.uid).once('value')
        .then((snapshot) => {
            this.setState({
                uid: user.uid,
                avatar: user.photoURL ? user.photoURL : defaultProfilePic,
                avatarRef: snapshot.val().avatarRef,
                username: user.email.substr(0, user.email.indexOf('@')) ? user.email.substr(0, user.email.indexOf('@')) : "", 
                profileName: user.displayName ? user.displayName : "",
            });
        })
    }

    editProfile() {
        this.setState({isLoading: true});
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

        let avatarChanged = true;
        if (this.state.avatar === user.photoURL) {
            avatarChanged = false;
        } else if (!user.photoURL && (this.state.avatar === defaultProfilePic)) {
            avatarChanged = false;
        }
        
        if (userEmail === user.email && this.state.email === this.props.email && !avatarChanged && this.state.profileName === user.displayName) {
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

        let self = this; //keep the this binding in self

        firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, this.state.confirmPassword))
        .then(() => {
            //get account type. If youth, stash in "pendingChanges"
            let uid = app.auth().currentUser.uid;
            app.database().ref('/users/' + uid).once('value').then(function(snapshot) {
                if (snapshot.val().type === "youth") {
                    self.savePendingProfile();
                }
                else {
                    self.savePermProfile();
                }
            });
        })
        .catch(() => {
            console.log("Invalid current password!");
            this.setState({ alertState: <Alert bsStyle="danger">Invalid Password!</Alert>});

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        })
    }

    savePermProfile() {
        let user = app.auth().currentUser;

        //update profile name & avatar
        user.updateProfile({
            displayName: this.state.profileName,
        })
        .then(() => {
            let avatarChanged = true;
            if (this.state.avatar === user.photoURL) {
                avatarChanged = false;
            } else if (!user.photoURL && (this.state.avatar === defaultProfilePic)) {
                avatarChanged = false;
            }
            if (avatarChanged && this.state.avatar !== defaultProfilePic) {
                let newUrl;
                
                //move image from tempAvatars to userAvatars
                app.storage().ref('userAvatars/' + this.state.newAvatarRef).put(this.state.avatarImg)
                .then((snapshot) => {
                    this.state.avatar = snapshot.downloadURL;
                    app.storage().ref('tempAvatars/' + this.state.newAvatarRef).delete()
                    .catch((err) => {
                        console.log("error deleting temp file! Have admin check storage!");
                    })
                })
                .then(() => { //delete existing image in userAvatars
                    app.storage().ref('userAvatars/' + this.state.avatarRef).delete()
                    .catch((err) => {
                        console.log("error deleting previous image!");
                        console.log(err);
                    })
                })
                .then(() => { //update avatarRef in database
                    app.database().ref('users/' + this.state.uid).update({ avatarRef: this.state.newAvatarRef })
                    .catch((err) => {
                        console.log("error updating ref in database...");
                    })
                })
                .then(() => {
                    //update avatar in auth
                    console.log(this.state.avatar);
                    user.updateProfile({
                        photoURL: this.state.avatar
                    })
                    .catch((err) => {
                        console.log("error updating profile picture!");
                        console.log(err);

                        this.setState({ alertState: <Alert bsStyle="danger">Error Updating Avatar!</Alert>});

                        window.setTimeout(() => {
                            this.setState({ alertState: null });
                        }, 5000);
                    })
                })
                .catch((err) => {
                    console.log("error uploading image to permanent link");
                })
            } else if (avatarChanged) { //removing previous image

                app.database().ref('users/' + this.state.uid).update({ avatarRef: this.state.newAvatarRef })
                .then(() => {
                    app.storage().ref('userAvatars/' + this.state.newAvatarRef).delete()
                    .catch((err) => {
                        console.log("error deleting previous picture!");
                        console.log(err);
                    })
                })
                .then(() => {
                    user.updateProfile({
                        photoURL: null
                    })
                    .catch((err) => {
                        console.log("error removing profile picture from auth!");
                        console.log(err);

                        this.setState({ alertState: <Alert bsStyle="danger">Error Updating Avatar!</Alert>});

                        window.setTimeout(() => {
                            this.setState({ alertState: null });
                        }, 5000);
                    })
                })
                .catch((err) => {
                    console.log("error updating ref in database...");
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

    savePendingProfile() {
        console.log("we're in the pending changes thing!");
        let userdata = {};
        let user = app.auth().currentUser;
        if ((this.state.username + "@halfway.com") !== user.email) {
            userdata['username'] = this.state.username;
        } if (this.state.email !== this.props.email) {
            userdata['email'] = this.state.email;
        } if (this.state.profileName !== user.displayName) {
            userdata['profileName'] = this.state.profileName;
        } if (this.state.avatar === defaultProfilePic && user.photoURL) {
            console.log("was a picture and now there's not")
            userdata['avatar'] = "removed";
        } else if (this.state.avatar !== user.photoURL && this.state.avatar !== defaultProfilePic) {
            console.log("picture changed");
            userdata['avatar'] = this.state.avatar;
            userdata['avatarRef'] = this.state.newAvatarRef;
        }

        console.log(userdata);

        app.database().ref('pendingProfiles/' + this.state.uid).set(userdata)
        .then(() => {
            this.setState({ 
                alertState: <Alert bsStyle="success">Submitted Account Changes for Approval!</Alert>,
                isLoading: false
            });

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
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
        })
    }

    onChangeImage(event) {
        console.log("getting image blob!");
        const image = event.target.files[0];
        if (image) {
            console.log("ready to start upload...")
            this.setState({ avatarImg: image });
            this.uploader.startUpload(image);
        }
    }

    handleUploadStart() {
        this.setState({
            isUploading: true, 
            progress: 0,
            alertState: <Alert bsStyle="success">Uploading Image: <ProgressBar active bsStyle="success" now={this.state.progress}/></Alert>
        });
    }

    handleProgress(progress) {
        console.log(progress);
        this.setState({progress: progress});
    }

    handleUploadError(err) {
        this.setState({
            alertState: <Alert bsStyle="danger">Failed to Upload Image!</Alert>
        });
        window.setTimeout(() => {
            this.setState({ alertState: null });
        }, 5000);
        console.log("error!");
        console.log(err);
    }

    handleUploadSuccess(filename) {
        this.setState({
            alertState: <Alert bsStyle="success">Image Uploaded!</Alert>
        });
        window.setTimeout(() => {
            this.setState({ alertState: null });
        }, 5000);

        let tempRef = this.state.newAvatarRef;

        if (tempRef) {
            //if a previous picture has been uploaded, delete the old temp picture in storage
            console.log("ready to delete picture!");

            app.storage().ref('tempAvatars/' + tempRef).delete()
            .catch(() => {
                console.log("failed to delete temp picture...");
            })
        }
        //if this isn't the saved picture, update ref and link
        if (filename !== this.state.avatarRef) {
            console.log("updating ref & image URL...");
            this.setState({
                newAvatarRef: filename  
            }); //save ref to new file

            //get downloaded url for avatar
            var storageRef = app.storage().ref();
            storageRef.child('tempAvatars/' + filename).getDownloadURL()
            .then((url) => {
                this.setState({
                    avatar: url
                });
                console.log(this.state.avatar);
            })
            .catch((err) => {
                console.log("error fetching url");
            });
        }
    }

    removeAvatar() {
        console.log("ready to remove photo...");
        if (this.state.newAvatarRef) {
            app.storage().ref('tempAvatars/' + this.state.newAvatarRef).delete()
            .catch((err) => {
                console.log("problem removing temp photo...");
                console.log(err);
            })         
        }

        this.setState({ 
            avatar: defaultProfilePic,
            newAvatarRef: null
        });
    }

    closeModal() {
        this.props.closeModal();
    }

    render() {
        return (
            <div className="static-modal">
                <Modal.Dialog>
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
                                        ref={c => { this.uploader = c; }}
                                        accept="image/*"
                                        filename={this.state.username}
                                        storageRef={app.storage().ref('tempAvatars')}
                                        onChange={this.onChangeImage}
                                        onUploadStart={this.handleUploadStart}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        onProgress={this.handleProgress}
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