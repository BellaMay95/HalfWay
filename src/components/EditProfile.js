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
            oldname: "",
            email: this.props.email ? this.props.email : "",
            avatar: "",
            avatarRef: "",
            newAvatarRef: "",
            profileName: "",
            confirmPassword: "",
            isLoading: false,
            isUploading: false,
            alertState: null,
            progress: 0,
            type: "",
            storageRef: app.storage().ref('userAvatars')
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
                newAvatarRef: snapshot.val().avatarRef,
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
        if (userEmail === user.email && this.state.email === this.props.email && !this.avatarChanged() && this.state.profileName === user.displayName) {
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
                //if avatar changed, upload and wait for success before saving changes
                if (this.avatarChanged() && this.state.avatar !== defaultProfilePic) {
                    this.setState({ storageRef: app.storage().ref('tempAvatars') });
                    this.uploader.startUpload(this.state.avatarImg);
                } else { //otherwise go ahead and call the save function
                    this.savePendingProfile();
                }
                return;
            }
            else { //otherwise go ahead and store changes in auth/database
                //if avatar changed, upload and wait for success before saving changes
                if (this.avatarChanged() && this.state.avatar !== defaultProfilePic) { //upload file if avatar changed
                    //console.log(this.uploader);
                    this.uploader.startUpload(this.state.avatarImg);
                } else { //otherwise go ahead and save the changes
                    this.savePermProfile();
                }
                return;
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
        let user = app.auth().currentUser;
        let change = true;
        if (this.state.avatar === user.photoURL) {
            change = false;
        } else if (!user.photoURL && (this.state.avatar === defaultProfilePic)) {
            change = false;
        }
        return change;
    }

    savePermProfile() {
        let user = app.auth().currentUser;
        let self = this;

        //update profile name
        user.updateProfile({
            displayName: this.state.profileName,
        })
        .then(() => { //update profile pic
            if (this.avatarChanged()) {
                let avatarError = false;
                //remove photo in storage if avatar removed OR the refs changed
                if (user.photoURL && this.state.avatarRef !== this.state.newAvatarRef) {
                    //console.log("removing photo in storage")
                    app.storage().ref('userAvatars/' + this.state.avatarRef).delete()
                    .catch((err) => {
                        console.log("error deleting photo in storage!");
                        console.log(err);
                        avatarError = true;
                    })
                }
                //update ref if refs aren't the same
                if(this.state.avatarRef !== this.state.newAvatarRef) {
                    //console.log("updating/deleting ref")
                    app.database().ref('users/' + this.state.uid).update({ 
                        //if link's removed, remove ref otherwise update
                        avatarRef: (this.state.newAvatarRef !== "removed") ? this.state.newAvatarRef : null
                    })
                    .catch((err) => {
                        console.log("error updating refs in database!");
                        console.log(err);
                        avatarError = true;
                    });
                }

                //in all cases update the link in auth
                //console.log("updating photo link")
                user.updateProfile({
                    //if photo removed, remove link otherwise update/add link
                    photoURL: (this.state.newAvatarRef !== "removed") ? this.state.avatar : null
                })
                .catch((err) => {
                    console.log("error setting link in auth!");
                    console.log(err);
                    avatarError = true;
                });

                //show alert if error
                if (avatarError) {
                    this.setState({ alertState: <Alert bsStyle="danger">Error Updating Avatar!</Alert>});

                    window.setTimeout(() => {
                        this.setState({ alertState: null });
                    }, 5000);
                }
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

    savePendingProfile() {
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
            } if (this.avatarChanged() && this.state.avatar === defaultProfilePic) {
                userdata['avatar'] = "removed";
                newComment += "avatar : "
            } if (this.avatarChanged() && this.state.avatar !== defaultProfilePic) {
                userdata['avatar'] = this.state.avatar;
                userdata['avatarRef'] = this.state.newAvatarRef;
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

        reader.onloadend = () => {
            this.setState({
                avatarImg: image,
                avatar: reader.result
            });
        }

        reader.readAsDataURL(image);
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

    handleUploadSuccess(filename, worker) {
        console.log("successfully uploaded image!");
        console.log(filename);
        console.log(worker.snapshot.downloadURL);
        this.setState({
            newAvatarRef: filename,
            avatar: worker.snapshot.downloadURL
        });
        //call the right save function
        if (this.state.type === "youth") {
            this.savePendingProfile();
        } else {
            this.savePermProfile();
        }
    }

    removeAvatar() {
        console.log("ready to remove photo...");
        this.setState({
            avatar: defaultProfilePic,
            newAvatarRef: "removed"
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
                                        ref={c => { this.uploader = c; }}
                                        accept="image/*"
                                        filename={this.state.oldname}
                                        storageRef={this.state.storageRef}
                                        onChange={this.onChangeImage}
                                        onUploadStart={this.handleUploadStart}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        onProgress={this.handleProgress}
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