import React, { Component } from 'react';
//import { render } from 'react-dom';
import SearchInput, {CreateFilter} from 'react-search-input';
import { Navbar, Nav, NavItem, Glyphicon, Image, Grid, Row, Col } from 'react-bootstrap';
import { app } from '../base';
import defaultProfilePic from '../images/defaultProfile.jpg'

export default class ViewProfile extends Component {
    constructor() {
        super();
        this.getEmail = this.getEmail.bind(this);
        this.state = {
            profileName: null,
            userName: null,
            avatar: defaultProfilePic,
            email: null
        }
    }

    componentWillMount() {
        let user = app.auth().currentUser;
        this.getEmail(user.uid)
        .then((email) => {
            console.log(email);
            this.setState({
                profileName: user.displayName,
                userName: user.email.substr(0, user.email.indexOf('@')),
                avatar: user.photoURL ? user.photoURL : defaultProfilePic,
                email: email
            });
        })
    }

    getEmail(uid) {
        return app.database().ref('/users/' + uid).once('value').then(function(snapshot) {
            return snapshot.val().email;
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
                        { myProfile ? <Navbar.Toggle /> : null }
                    </Navbar.Header>
                { myProfile ? 
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem id="editProfile" eventKey={1}>
                                Edit Profile
                                <Glyphicon glyph="edit" style={{padding: '5px'}}/>
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse> : null
                }
                </Navbar>

                <Grid style={{padding: '15px'}}>
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
                        <h1>Profile Information</h1>
                        <Col xs={4}>
                            <Image src={this.state.avatar} rounded responsive />
                        </Col>
                        <Col xs={8}>
                            <p>Display Name: {this.state.profileName}</p>
                            <p>Username: {this.state.userName}</p>
                            { this.state.email ? <p>Email: {this.state.email}</p> : null}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <h1>Recent Forum Posts...coming soon!</h1>
                    </Row>
                </Grid>

            </div>
        );
    }
}