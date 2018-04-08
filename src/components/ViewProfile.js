import React, { Component } from 'react';
//import { render } from 'react-dom';
import SearchInput, {createFilter} from 'react-search-input';
import { Navbar, Image, Grid, Row, Col, DropdownButton, MenuItem, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import { app } from '../base';
import defaultProfilePic from '../images/defaultProfile.jpg';

import EditProfile from './EditProfile';
import PendingChanges from './YouthProfileChanges';
import ChangePassword from './ChangePassword';

const KEYS_TO_FILTERS = ['username', 'displayName'];

export default class ViewProfile extends Component {
    constructor() {
        super();
        this.getData = this.getData.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.togglePendingChangesModal = this.togglePendingChangesModal.bind(this);
        this.togglePasswordModal = this.togglePasswordModal.bind(this);
        this.saveChangesAlert = this.saveChangesAlert.bind(this);
        this.setSearch = this.setSearch.bind(this);

        this.state = {
            profileName: null,
            userName: null,
            avatar: defaultProfilePic,
            email: null,
            editProfile: false,
            pendingChanges: false,
            showChanges: false,
            changePassword: false,
            accType: "",
            alertState: null,
            searchTerm: "",
            userList: []
        }
    }

    componentWillMount() {
        let user = app.auth().currentUser;
        //console.log(user);
        this.getData(user.uid)
        .then((data) => {
            this.setState({
                profileName: user.displayName,
                userName: user.email.substr(0, user.email.indexOf('@')),
                avatar: data.avatar ? data.avatar : defaultProfilePic,
                email: data.email,
                accType: data.type
            });
        });

        var getUsers = app.functions().httpsCallable('userList');
        getUsers()
        .then((list) => {
            console.log(list);
            this.setState({ userList: list.data });
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

    getData(uid) {
        return app.database().ref('/users/' + uid).once('value').then(function(snapshot) {
            return {
                email: snapshot.val().email,
                type: snapshot.val().type,
                avatar: snapshot.val().avatar
            };
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
        this.setState({ alertState: <Alert bsStyle="success">{message}</Alert>});

        window.setTimeout(() => {
            this.setState({ alertState: null });
        }, 5000);
    }

    setSearch(input) {
        this.setState({searchTerm: input});
    }

    setUserProfile(user) {
        app.database().ref('users/' + user.uid).once('value')
        .then((snapshot) => {
            this.setState({
                userName: user.username,
                profileName: user.displayName,
                avatar: snapshot.val().avatar
            })
        })
        .catch((err) => {
            console.log("failed to extract avatar!");
            console.log(err);
            this.setState({
                userName: user.username,
                profileName: user.displayName,
                avatar: defaultProfilePic   //will make this the right thing later
            });
        })
    }
    
    render() {
        let headerStyle = {
            fontFamily: "'Courier New', 'Courier', 'monospace'",
            fontSize: 36,
            fontWeight: "bold"
        }
        let myProfile = (this.state.profileName === app.auth().currentUser.displayName);

        const filteredUsers = this.state.userList.length > 0 ? this.state.userList.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)) : [];

        return (
            <div className="container">              
                <Navbar collapseOnSelect style={{marginTop: '5px', paddingRight: '0px'}}>
                    <Navbar.Header>
                        <Navbar.Brand id="profileHeader" style={headerStyle}>User Profiles</Navbar.Brand>
                    </Navbar.Header>
                </Navbar>

                {this.state.alertState}

                <Grid style={{padding: '15px'}} fluid={true}>
                    <Row>
                        <Col xs={4}>
                            <label>Search For User!</label>
                        </Col>
                        <Col xs={8}>
                            <SearchInput className="search-input" style={{width: "90%"}} onChange={this.setSearch} />
                            { this.state.searchTerm !== "" ? <ListGroup> {filteredUsers.map((record) => {
                                return (
                                    <ListGroupItem key={record.uid} header={record.displayName} onClick={() => {this.setUserProfile(record)}}>{record.username}</ListGroupItem>
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
                            <MenuItem eventKey="1" onClick={this.toggleEditModal}>Edit Profile</MenuItem>
                            <MenuItem eventKey="2" onClick={this.togglePasswordModal}>Change Password</MenuItem>
                            { this.state.accType === "youth" ? <MenuItem eventKey="3" onClick={this.togglePendingChangesModal}>Pending Changes</MenuItem> : null }
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

                {this.state.editProfile && <EditProfile showAlert={this.saveChangesAlert} email={this.state.email} closeModal={this.toggleEditModal} />}
                {this.state.changePassword && <ChangePassword showAlert={this.saveChangesAlert} closeModal={this.togglePasswordModal} />}
                {this.state.accType === "youth" && this.state.showChanges && <PendingChanges email={this.state.email} avatar={this.state.avatar} closeModal={this.togglePendingChangesModal} />}
            </div>
        );
    }
}