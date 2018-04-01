import React, { Component } from 'react';
//import { render } from 'react-dom';
import SearchInput /*, {CreateFilter}*/ from 'react-search-input';
import { Navbar, Nav, NavItem, Glyphicon, Image, Grid, Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';
import { app } from '../base';
import defaultProfilePic from '../images/defaultProfile.jpg';

import EditProfile from './EditProfile';
import PendingChanges from './YouthProfileChanges';
import ChangePassword from './ChangePassword';

export default class ViewProfile extends Component {
    constructor() {
        super();
        this.getEmail = this.getEmail.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.togglePendingChangesModal = this.togglePendingChangesModal.bind(this);
        this.changePasswordModal = this.changePasswordModal.bind(this);
        this.state = {
            profileName: null,
            userName: null,
            avatar: defaultProfilePic,
            email: null,
            editProfile: false,
            pendingChanges: false,
            showChanges: false,
            changePassword: false,
            accType: ""
        }
    }

    componentWillMount() {
        let user = app.auth().currentUser;
        this.getEmail(user.uid)
        .then((email) => {
            this.setState({
                profileName: user.displayName,
                userName: user.email.substr(0, user.email.indexOf('@')),
                avatar: user.photoURL ? user.photoURL : defaultProfilePic,
                email: email
            });
        });

        //check to see if pending changes
        app.database().ref('/pendingProfiles/' + user.uid).once('value')
        .then((snapshot) => {
            if (snapshot.val()) {
                this.setState({pendingChanges: true});
                console.log("pending changes!");
            } else {
                console.log("no pending changes!");
            }
        });
        
    }

    getEmail(uid) {
        return app.database().ref('/users/' + uid).once('value').then(function(snapshot) {
            return snapshot.val().email;
		});
    }

    toggleEditModal() {
        this.setState({
          editProfile: !this.state.editProfile
        });

        //re-check on modal close
        let user = app.auth().currentUser;
        this.getEmail(user.uid)
        .then((email) => {
            this.setState({
                profileName: user.displayName,
                userName: user.email.substr(0, user.email.indexOf('@')),
                avatar: user.photoURL ? user.photoURL : defaultProfilePic,
                email: email
            });
        });

        //check to see if pending changes
        app.database().ref('/pendingProfiles/' + user.uid).once('value')
        .then((snapshot) => {
            if (snapshot.val()) {
                this.setState({pendingChanges: true});
                console.log("pending changes!");
            } else {
                console.log("no pending changes!");
            }
        });
       
    }

    togglePendingChangesModal() {
        this.setState({
            showChanges: !this.state.showChanges
        });
    }

    changePasswordModal() {
        this.setState({
            changePassword: !this.state.changePassword
        });
    }
    
    render() {
        let headerStyle = {
            fontFamily: "'Courier New', 'Courier', 'monospace'",
            fontSize: 36,
            fontWeight: "bold"
        }
        let myProfile = (this.state.profileName === app.auth().currentUser.displayName);

        return (
            <div className="container">              
                <Navbar collapseOnSelect style={{marginTop: '5px', paddingRight: '0px'}}>
                    <Navbar.Header>
                        <Navbar.Brand id="profileHeader" style={headerStyle}>User Profiles</Navbar.Brand>
                    </Navbar.Header>
                </Navbar>

                <Grid style={{padding: '15px'}} fluid={true}>
                    <Row>
                        <Col xs={4}>
                            <label>Search For User!</label>
                        </Col>
                        <Col xs={8}>
                            <SearchInput className="search-input" style={{width: "90%"}}/>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        { myProfile ?
                        <div><Col xs={8}>
                            <h1>Profile Information</h1>
                        </Col>
                        <Col xs={4}>
                        <DropdownButton
                            style={{marginTop: '15px'}}
                            bsStyle="default"
                            title="View/Edit Profile"
                            id="editProfileDropdown"
                            >
                            <MenuItem eventKey="1" onClick={this.toggleEditModal}>Edit Profile</MenuItem>
                            <MenuItem eventKey="2" onClick={this.togglePendingChangesModal}>Pending Changes</MenuItem>
                            <MenuItem eventKey="3" onClick={this.changePasswordModal}>Change Password</MenuItem>
                        </DropdownButton>
                            
                            {/*<Button bsStyle="default" onClick={this.togglePendingChangesModal}>Pending Changes <Glyphicon glyph="edit" style={{padding: '5px'}}/></Button>
                            <Button bsStyle="default" onClick={this.toggleEditModal}>Edit Profile <Glyphicon glyph="edit" style={{padding: '5px'}}/></Button>                   */}
                        </Col></div> : <h1>Profile Information</h1> }
                    </Row>
                    <Row>
                        
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <Image src={this.state.avatar} rounded responsive />
                        </Col>
                        <Col xs={8}>
                            <p>Display Name: {this.state.profileName}</p>
                            <p>Username: {this.state.userName}</p>
                            { this.state.email ? <p>Email: {this.state.email}</p> : null}
                        </Col>
                    </Row>
                    {/*<hr />
                    <Row>
                        <h1>Recent Forum Posts</h1>
                    </Row>*/}
                </Grid>

                {this.state.editProfile && <EditProfile email={this.state.email} closeModal={this.toggleEditModal} />}
                {this.state.showChanges && <PendingChanges />}
                {this.state.changePassword && <ChangePassword />}
            </div>
        );
    }
}