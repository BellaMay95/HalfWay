import React, { Component } from 'react';
//import { render } from 'react-dom';
import SearchInput, {createFilter} from 'react-search-input';
import { Navbar, Image, Grid, Row, Col, DropdownButton, MenuItem, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import { app } from '../base';
import defaultProfilePic from '../images/defaultProfile.jpg';

import EditProfile from './EditProfile';
import PendingChanges from './YouthProfileChanges';
import ChangePassword from './ChangePassword';
import './ViewProfile.css';

const KEYS_TO_FILTERS = ['username', 'displayName'];

export default class ViewProfile extends Component {
    constructor() {
        super();
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.togglePendingChangesModal = this.togglePendingChangesModal.bind(this);
        this.togglePasswordModal = this.togglePasswordModal.bind(this);
        this.saveChangesAlert = this.saveChangesAlert.bind(this);
        this.setSearch = this.setSearch.bind(this);
        this.initialLoad = this.initialLoad.bind(this);

        this.state = {
            profileName: null,
            avatar: defaultProfilePic,
            email: null,
            created: "",
            editProfile: false,
            pendingChanges: false,
            showChanges: false,
            changePassword: false,
            accType: "",
            alertState: null,
            searchTerm: "",
            disableSearch: true,
            userList: [],
        }
    }

    componentWillMount() {
        return this.initialLoad();
    }

    initialLoad() {
        let user = app.auth().currentUser;

        user.getIdToken()
        .then((idToken) => {
            // Parse the ID token.
            idToken = idToken.replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            console.log(user.displayName);
            this.setState({
                profileName: user.displayName,
                email: user.email,
                avatar: user.photoURL ? user.photoURL : defaultProfilePic,
                accType: payload['type'] ? payload['type'] : "youth", //default to youth access if credentials can't be determined
                created: user.metadata.creationTime
            })
        })
        .catch((error) => {
            console.log(error);
        });


        var getUsers = app.functions().httpsCallable('userList');
        getUsers()
        .then((list) => {
            console.log(list);
            this.setState({ 
                userList: list.data, 
                disableSearch: false
            });
        })
        .catch((err) => {
            console.log("error getting user list!");
            console.log(err);
        })

        //check to see if pending changes
        app.database().ref('/pendingProfiles/' + user.uid).on('value', (snapshot) => {
            if (snapshot.val()) {
                this.setState({pendingChanges: true});
                console.log("pending changes!");
            } else {
                console.log("no pending changes!");
            }
        });
    }

    toggleEditModal() {
        this.setState({
          editProfile: !this.state.editProfile
        });
    }

    togglePendingChangesModal() {
        this.setState({
            showChanges: !this.state.showChanges
        });
    }

    togglePasswordModal() {
        this.setState({
            changePassword: !this.state.changePassword
        });
    }

    saveChangesAlert(message) {
        this.initialLoad();
        this.setState({ alertState: <Alert bsStyle="success">{message}</Alert>});

        window.setTimeout(() => {
            this.setState({ alertState: null });
        }, 5000);
        
    }

    setSearch(input) {
        this.setState({searchTerm: input});
    }

    setUserProfile(user) {
        console.log(user);

        this.setState({
            email: user.displayName === app.auth().currentUser.displayName ? app.auth().currentUser.email : user.email,
            profileName: user.displayName,
            avatar: user.avatar ? user.avatar : defaultProfilePic,
            created: user.creationTime,
            accType: user.type.type,
            searchTerm: ""
        });
    }

    render() {
        let myProfile = (this.state.profileName === app.auth().currentUser.displayName);

        const filteredUsers = this.state.userList.length > 0 ? this.state.userList.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)) : [];

        return (
            <div className="container">
                <Navbar className="navbarProfile" collapseOnSelect style={{marginTop: '5px', paddingRight: '0px'}}>
                    <Navbar.Header>
                      <span><h3 className="brandProfile">User Profiles</h3></span>
                    </Navbar.Header>
                </Navbar>

                {this.state.alertState}

                <Grid className="gridProfile" style={{padding: '15px'}} fluid={true}>
                    <Row>
                        <Col xs={4}>
                            <label>Search For User!</label>
                        </Col>
                        <Col xs={8}>
                            <SearchInput id="searchUsers" className="search-input" style={{width: "90%"}} onChange={this.setSearch} disabled={this.state.disableSearch} />
                            { this.state.searchTerm !== "" ? <ListGroup> {filteredUsers.map((record) => {
                                return (
                                    <ListGroupItem key={record.uid} onClick={() => {this.setUserProfile(record)}}>{record.displayName}</ListGroupItem>
                                )
                            })} </ListGroup> : null }
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
                            <MenuItem id="editProfile" eventKey="1" onClick={this.toggleEditModal}>Edit Profile</MenuItem>
                            <MenuItem id="changePassword" eventKey="2" onClick={this.togglePasswordModal}>Change Password</MenuItem>
                            { this.state.accType === "youth" ? <MenuItem id="viewPending" eventKey="3" onClick={this.togglePendingChangesModal}>Pending Changes</MenuItem> : null }
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
                            <p id="userDisplay">Display Name: {this.state.profileName}</p>
                            <p id="userCreated">Member Since: {this.state.created}</p>
                            <p id="userType">User Role: {this.state.accType}</p>
                            { this.state.email ? <p id="userEmail">Email: {this.state.email}</p> : null}
                        </Col>
                    </Row>
                    {/*<hr />
                    <Row>
                        <h1>Recent Forum Posts</h1>
                    </Row>*/}
                </Grid>

                {this.state.editProfile && <EditProfile showAlert={this.saveChangesAlert} type={this.state.accType} closeModal={this.toggleEditModal} />}
                {this.state.changePassword && <ChangePassword showAlert={this.saveChangesAlert} closeModal={this.togglePasswordModal} />}
                {this.state.accType === "youth" && this.state.showChanges && <PendingChanges closeModal={this.togglePendingChangesModal} />}
            </div>
        );
    }
}
