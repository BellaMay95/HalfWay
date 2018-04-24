import React, { Component } from 'react';
//import { render } from 'react-dom';
import { app } from '../base';
import firebase from 'firebase';

import { Table, Button, Modal, Image, Alert, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import defaultProfilePic from '../images/defaultProfile.jpg';
require("firebase/functions");

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

export default class ProfileChanges extends Component {
    constructor() {
        super();
        this.pendingThreads = this.pendingThreads.bind(this);
        this.viewProfile = this.viewProfile.bind(this);
        this.showAlerts = this.showAlerts.bind(this);

        this.state = {
            pendingChanges: null,
            tableContents: null,
            showProfile: false,
            uid: null,
            alertShow: null,
        }
    }

    componentWillMount() {
        app.database().ref('pendingProfiles').on('value',(snapshot) => {
            this.setState({
                pendingChanges: snapshot.val()
            });
            //console.log(this.state.pendingChanges);
            this.pendingThreads();
        });       
    }

    pendingThreads() {
        let changes = this.state.pendingChanges;
        let tempContents = [];
        console.log(changes);
        let count = 0;

        for (var profile in changes) {
            let profileId = "viewProfile" + count;
            if( changes.hasOwnProperty(profile) ) {
                tempContents.unshift(
                    <tr key = {count} id="">
                        <td>{changes[profile].currname}</td>
                        <td>{changes[profile].status}</td>
                        <td>
                            <Button id={profileId} bsStyle="primary" onClick={
                                //eslint-disable-next-line
                                () => {this.viewProfile(profile)}
                            }>View</Button>
                        </td>
                    </tr>
                );
                count++;
            } 
        }
        if (tempContents.length === 0) {
            tempContents.push(<tr key={1}><td colSpan={3}>No pending changes for review!</td></tr>);
            console.log(tempContents);
        }
        this.setState({ tableContents: tempContents });
    }

    viewProfile(uid) {
        this.setState({
            showProfile: !this.state.showProfile,
            uid: uid
        });
    }

    showAlerts(message, style) {
        console.log("showing alert!");
        console.log("message:", message);
        this.setState({
            alertShow: <Alert bsStyle={style}>{message}</Alert>
        });

        window.setTimeout(() => {
            this.setState({ alertShow: null });
        }, 5000);
    }

    render() {
        return (
            <div>
                {this.state.alertShow}
                <Table responsive bordered striped>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.tableContents }
                    </tbody>
                </Table>
                { this.state.showProfile && this.state.pendingChanges && this.state.uid && <ViewProfileChanges showAlert={this.showAlerts} closeModal={this.viewProfile} pending={ this.state.pendingChanges[this.state.uid] } uid={ this.state.uid } /> }
            </div>
        );
    }
}

export class ViewProfileChanges extends Component {
    constructor(props) {
        super(props);
        this.approveChanges = this.approveChanges.bind(this);
        this.rejectChanges = this.rejectChanges.bind(this);

        this.state = {
            changes: this.props.pending,
            user: {},
            reason: "",
            alertState: null,
            isLoading: true,
            password: ""
        }
        //console.log(this.state.changes);
    }

    componentWillMount() {
        let self = this;

        var getUser = firebase.functions().httpsCallable('getUserRecordByUid');
        getUser({ uid: this.props.uid })
        .then((data) => {
            console.log(data);
            self.setState({
                user: data.data,
                isLoading: false
            });
            console.log(self.state.user);
        })
        .catch((err) => {
            console.log("failed to fetch user data!");
            console.log(err);
        })
    }
    
    approveChanges() {
        this.setState({isLoading: true});

        if (this.state.password === "") {
            console.log("You must enter your admin password!");
            this.setState({
                alertState: <Alert bsStyle="warning">You Must Enter Your Password!</Alert>,
                isLoading: false
            })

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        let self = this;

        firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, this.state.password))
        .then(() => {
            let body = this.state.changes;
            body.uid = this.props.uid;
    
            var saveProfile = firebase.functions().httpsCallable('saveProfile');
            saveProfile(body)
            .then(function(result) {
                console.log(result);
    
                /*self.setState({ isLoading: false });
                self.props.showAlert("Profile Changes Approved!", "success");
                self.props.closeModal();*/
                this.setState({ isLoading: false });
                this.props.showAlert("Profile Changes Approved!", "success");
                this.props.closeModal();
            })
            .catch((err) => {
                console.log("error!");
                console.log(err);

                self.setState({ 
                    alertState: <Alert bsStyle="danger">Failed to Approve Changes!</Alert>,
                    isLoading: false 
                });
            })
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                alertState: <Alert bsStyle="danger">Invalid Password!</Alert>,
                isLoading: false
            })

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
        });
    }

    rejectChanges() {
        this.setState({isLoading: true});
        
        if (this.state.password === "") {
            console.log("You must enter your admin password!");
            this.setState({
                alertState: <Alert bsStyle="warning">You Must Enter Your Password!</Alert>,
                isLoading: false
            })

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        if (this.state.reason === "") {
            console.log("You must provide a reason for rejection!");
            this.setState({
                alertState: <Alert bsStyle="warning">You Must Provide a Reason for Rejection in the Comments Field Below!</Alert>,
                isLoading: false
            })

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, this.state.password))
        .then(() => {
            let changes = this.state.changes;
            let date = new Date().toLocaleString();
    
            changes.comments.push(date + ": rejected: " + this.state.reason);
            changes.status = "rejected";
    
            app.database().ref('pendingProfiles/' + this.props.uid).update(changes)
            .then(() => {
                this.setState({isLoading: false});
                console.log("Successfully rejected a student's profile changes");
                this.props.showAlert("Successfully rejected profile changes!", "success");
                this.props.closeModal();
            })
            .catch((err) => {
                this.setState({isLoading: false})
                console.log("Failed to reject user profiles!");
                console.log(err);
                this.props.showAlert("Error rejecting profile changes!", "danger");
                this.props.closeModal();
            })
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                alertState: <Alert bsStyle="danger">Invalid Password!</Alert>,
                isLoading: false
            })

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
        });
    }

    render() {
        //console.log(this.state);
        return (
            <Modal.Dialog style={{ overflow: 'auto' }}>
                
                <Modal.Header>
                <Modal.Title>View Pending Changes -- {this.state.changes.currname }</Modal.Title>
                </Modal.Header>
                {this.state.alertState}
                <Modal.Body>
                <Table responsive striped condensed hover bordered>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Old Value</th>
                            <th>New Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.changes.username ?
                        <tr>
                            <td>Username</td>
                            <td>{this.state.user && this.state.user.username ? this.state.user.username.substr(0, this.state.user.username.indexOf('@')) : "" }</td>
                            <td>{this.state.changes.username}</td>
                        </tr> : null }
                        { this.state.changes.email ?
                        <tr>
                            <td>Email</td>
                            <td>{this.state.user && this.state.user.email ? this.state.user.email : ""}</td>
                            <td>{this.state.changes.email}</td>
                        </tr> : null }
                        { this.state.changes.profileName ?
                        <tr>
                            <td>Profile Name</td>
                            <td>{this.state.user && this.state.user.displayName ? this.state.user.displayName : ""}</td>
                            <td>{this.state.changes.profileName}</td>
                        </tr> : null }
                        { this.state.changes.avatar ?
                        <tr>
                            <td>Avatar</td>
                            <td><Image src={this.state.user && this.state.user.photoURL ? this.state.user.photoURL : defaultProfilePic } responsive rounded /></td>
                            <td>{ this.state.changes.avatar === "removed" ? "Avatar Removed" : <Image src={this.state.changes.avatar} responsive rounded />}</td>
                        </tr> : null }
                        <tr>
                            <td>Comments:</td>
                            <td colSpan="2">{ this.state.changes.comments.map((m, i) => <p key={`message-${i}`}>{m}</p>)}</td>
                        </tr>
                    </tbody>
                </Table>
                <FieldGroup
                    id="formControlsComments"
                    type="text"
                    label="Comments -- Required for Rejection"
                    onChange={(evt) => {this.setState({ reason: evt.target.value})}}
                />
                <FieldGroup
                    id="formControlsPassword"
                    type="password"
                    label="Admin Password"
                    onChange={(evt) => {this.setState({ password: evt.target.value})}}
                />

                </Modal.Body>

                <Modal.Footer>
                    <Button id="closeModal" bsStyle="default" onClick={this.props.closeModal} >Close</Button>
                    <Button id="rejectChanges" bsStyle="danger" onClick={this.rejectChanges} disabled={this.state.isLoading || this.state.changes.status === "rejected"}>Reject</Button>
                    <Button id="acceptChanges" bsStyle="success" onClick={this.approveChanges} disabled={this.state.isLoading || this.state.changes.status === "rejected"}>Approve</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}