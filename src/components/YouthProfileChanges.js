import React, { Component } from 'react';
import { app } from '../base';

import { Modal, Table, Button, Image } from 'react-bootstrap';
//import defaultProfilePic from '../images/defaultProfile.jpg';

export default class PendingChanges extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changes: null,
            user: null
        }
    }

    componentWillMount() {
        let user = app.auth().currentUser;
        app.database().ref('pendingProfiles/' + user.uid).once('value')
        .then((snapshot) => {
            this.setState({ 
                user: user,
                changes: snapshot.val()
            });
        })
    }

    render() {
        return (
            <Modal.Dialog style={{ overflow: 'auto' }}>
                
                <Modal.Header>
                <Modal.Title>View Pending Changes</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                { !this.state.changes ? <p>No pending changes on your profile. Submit some now!</p>
                : <Table responsive striped condensed hover bordered>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Old Value</th>
                            <th>New Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.changes && this.state.changes.username ?
                        <tr>
                            <td>Email</td>
                            <td>{this.state.user.email}</td>
                            <td>{this.state.changes.username}</td>
                        </tr> : null }
                        { this.state.changes && this.state.changes.profileName ?
                        <tr>
                            <td>Profile Name</td>
                            <td>{this.state.user.displayName}</td>
                            <td>{this.state.changes.profileName}</td>
                        </tr> : null }
                        { this.state.changes && this.state.changes.avatar ?
                        <tr>
                            <td>Avatar</td>
                            <td><Image src={this.state.user.photoURL} responsive rounded /></td>
                            <td>{ this.state.changes.avatar === "removed" ? "Avatar Removed" : <Image src={this.state.changes.avatar} responsive rounded />}</td>
                        </tr> : null }
                        <tr>
                            <td>Comments:</td>
                            <td colSpan="2">{this.state.changes.comments.map((m, i) => <p key={`message-${i}`}>{m}</p>)}</td>
                        </tr>
                    </tbody>
                </Table>

                }

                </Modal.Body>

                <Modal.Footer>
                    <Button id="closeModal" bsStyle="primary" onClick={this.props.closeModal} >Close</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}