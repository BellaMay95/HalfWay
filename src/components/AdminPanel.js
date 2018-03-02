import React, { Component } from 'react';
import { render } from 'react-dom';
import { Nav, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';

import ViewFlags from './ViewFlags';
import CreateAccount from './CreateAccount';
import ProfileChanges from './ProfileChanges';

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.chooseTool = this.chooseTool.bind(this);
        this.state = {
            panelContent: <p>Welcome! Please select something!</p>
        }
    }

    chooseTool(option) {
        console.log(option);
        if (option === 1) {
            this.setState({panelContent: <CreateAccount />});
        } else if (option === 2) {
            this.setState({panelContent: <ViewFlags />});
        } else if (option === 3) {
            this.setState({panelContent: <ProfileChanges />});
        } else {
            this.setState({panelContent: <p>ERROR in selection! Please try again!</p>});
            console.log("ERROR!");
        }
    }

    render() {
        let headerStyle = {
            fontFamily: "'Courier New', 'Courier', 'monospace'", 
            fontSize: 36, 
            fontWeight: "bold"
        }

        return ((<div className="container">
            <Navbar collapseOnSelect style={{marginTop: '5px'}}>
                <Navbar.Header>
                    <Navbar.Brand style={headerStyle}>Admin Panel</Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight style={{marginRight: "10px"}}>
                        <NavDropdown eventKey={1} title="Select Tool" id="select-func">
                            <MenuItem eventKey={1.1} onSelect={() => this.chooseTool(1)}>Create Account</MenuItem>
                            <MenuItem eventKey={1.2} onSelect={() => this.chooseTool(2)}>View Flagged Posts</MenuItem>
                            <MenuItem eventKey={1.3} onSelect={() => this.chooseTool(3)}>View Pending Profile Changes</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <p>Admin Panel under construction! Please check back later!</p>
            {this.state.panelContent}
        </div>)
        );
    }
}