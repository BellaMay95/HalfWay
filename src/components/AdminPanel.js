import React, { Component } from 'react';
//import { render } from 'react-dom';
import { Nav, Navbar, NavDropdown, MenuItem, Tabs, Tab } from 'react-bootstrap';

import ViewFlags from './ViewFlags';
import { CreateAccount, ChangeAccount, DeleteAccount } from './ManageAccount';
import ProfileChanges from './AdminProfileChanges';
import './AdminPanel.css';

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.chooseTool = this.chooseTool.bind(this);
        this.state = {
            panelContent: <ViewFlags />
        }
    }

    chooseTool(option) {
        //console.log(option);
        if (option === 1) {
            this.setState({
                panelContent: <Tabs defaultActiveKey={1} id="manage-account-tabs">
                    <Tab eventKey={1} title="Create New Account">
                        <CreateAccount />
                    </Tab>
                    <Tab eventKey={2} title="Delete Account">
                        <DeleteAccount />
                    </Tab>
                    <Tab eventKey={3} title="Change Account Type">
                        <ChangeAccount />
                    </Tab>
                </Tabs>
            });
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
        return ((<div className="container">
            <Navbar className="navbarAdmin" collapseOnSelect style={{marginTop: '5px'}}>
                <Navbar.Header>
                    <span><h3 className="brandAdmin">Admin Panel</h3></span>
                    {/*<Navbar.Brand id="adminHeader" style={headerStyle}>Admin Panel</Navbar.Brand>*/}
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight style={{marginRight: "10px"}}>
                        <NavDropdown eventKey={1} title="Select Tool" id="select-func">
                            <MenuItem id="accounts" eventKey={1.1} onSelect={() => this.chooseTool(1)}>Manage Accounts</MenuItem>
                            <MenuItem id="flags" eventKey={1.2} onSelect={() => this.chooseTool(2)}>View Flagged Posts</MenuItem>
                            <MenuItem id="profile" eventKey={1.3} onSelect={() => this.chooseTool(3)}>View Pending Profile Changes</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {/*<p>Admin Panel under construction! Please check back later!</p>*/}
            {this.state.panelContent}
        </div>)
        );
    }
}
