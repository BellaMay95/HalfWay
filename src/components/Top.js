import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import Logout from './Logout';
import { Route } from 'react-router-dom';

//import logo from './logo.svg';

//import './Top.css';

class Top extends Component {
    constructor(props) {
        super(props);
        this.handleProfileClick = this.handleProfileClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = {
            authenticated: props.authenticated, 
            name: props.name
        };
    }

    handleProfileClick() {
        console.log("clicked profile button");
    }

    handleLogoutClick() {
        console.log("clicked logout button");
        //this.props.setLoginState(false, "");
    }

    loggedInNav(name) {
        console.log(name);
        let title = "Welcome, " + name.displayName + "!";

        return (<div><Route exact path="/logout" component={Logout} />
        <Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#brand">HalfWay</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    <NavDropdown eventKey={1} title={title} id="basic-nav-dropdown">
                    <MenuItem eventKey={3.1} onClick={this.handleProfileClick}>View Profile</MenuItem>
                    <MenuItem eventKey={3.2} href="/logout">Logout</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar></div>);
    }

    loggedOutNav() {
        return <Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                <a href="#brand">HalfWay</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
        </Navbar>;
    }
    
    render() {
        let Navbar = null;
        if (this.props.authenticated) {
            Navbar = this.loggedInNav(this.props.name);
        } else {
            Navbar = this.loggedOutNav();
        }
        return Navbar;
    }
}

export default Top;