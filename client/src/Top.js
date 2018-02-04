import React, { Component } from 'react';
import { Navbar, Nav, NavItem, DropdownButton, MenuItem } from 'react-bootstrap';

//import logo from './logo.svg';

import './Top.css';

class Top extends Component {
    constructor(props) {
        super(props);
        this.handleProfileClick = this.handleProfileClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = {
            isLoggedIn: props.isLoggedIn, 
            name: props.name
        };
    }

    handleProfileClick() {
        console.log("clicked profile button");
    }

    handleLogoutClick() {
        console.log("clicked logout button");
        this.props.setLoginState(false, "");
    }

    LoginButton(isLoggedIn) {
        if (isLoggedIn) {
            let title = "Welcome, User!";
            let button = <DropdownButton
                bsStyle="default"
                title={title}
                key={2}
                id={2}
            >
                <MenuItem eventKey="1" onClick={this.handleProfileClick}>View Profile</MenuItem>
                <MenuItem eventKey="2" onClick={this.handleLogoutClick}>Log Out!</MenuItem>
            </DropdownButton>;
            return button;
        }
        return null;
    };
    
    render() {
        let Button = this.LoginButton(this.props.isLoggedIn);
        
        return (
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">HalfWay</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">
                            {Button}
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Top;