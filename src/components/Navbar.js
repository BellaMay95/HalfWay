import React, { Component } from 'react';
//import { render } from 'react-dom';
import forum from '../images/forum.png';
import directmessage from '../images/directmessage.png';
import help from '../images/help.png';
import settings from '../images/settings.png';
import logout from '../images/logout.png';
import logo from '../images/HWtrial2.png';
import admin from '../images/usersecret.png';

import { Navbar, Nav, NavItem } from 'react-bootstrap';
//import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import { app } from '../base';

import ForumList from './ForumList';
import AdminPanel from './AdminPanel';
import Resources from './Resources';


export default class TopNavbar extends Component {
  constructor() {
	super();
	this.checkAdmin = this.checkAdmin.bind(this);
	this.state = {
	  tabContent: <ForumList />,
	  admin: false
	}
  }

  componentWillMount() {
	//checks for admin privileges before rendering component
		this.checkAdmin()
		.then((result) => {
			//set admin state based on result of check
			console.log("I'm an admin!")
			this.setState({ admin: result });
		})
		.catch((err) => {
			//if there was an error checking privileges, set to false
			console.log("I'm not an admin!");
			this.setState({ admin: false });
		})
  }

  checkAdmin() {
		//get user ID for lookup in database table
		let uid = app.auth().currentUser.uid;
		return app.database().ref('/users/' + uid).once('value').then(function(snapshot) {
			//return whether the user has admin privileges
			if (snapshot.val().type === "admin") {
				return true;
			}
			else {
				return false;
			}
		});
  	}

	render() {
		console.log("Admin: " + this.state.admin);
		return (
			<div>
				<Navbar collapseOnSelect>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="/" style={{padding: 3}}>< img height = '55px' width = '55px' src = {logo} alt = "HalfWay logo" /></a>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							<NavItem eventKey={1} onSelect={() => {this.setState({tabContent: <ForumList />})}}>
								<img height = '30' width = '30' src = {forum} alt = "Forum" />     Forum
							</NavItem>
							<NavItem eventKey={2} onSelect={() => {this.setState({tabContent: "direct message component here"})}}>
								<img height = '30' width = '30' src = {directmessage} alt = "Direct message" />     Message
							</NavItem>
							<NavItem eventKey={3} onSelect={() => {this.setState({tabContent: "settings component here"})}}>
								<img height = '30' width = '30' src = {settings} alt = "User settings" />     Settings
							</NavItem>
							<NavItem eventKey={4} onSelect={() => {this.setState({tabContent: <Resources />})}}>
								<img height = '30' width = '30' src = {help} alt = "Resources page" />     Help
							</NavItem>
							{ this.state.admin ?
								<NavItem eventKey={5} onSelect={() => {this.setState({tabContent: <AdminPanel />})}}>
									<img height = '30' width = '30' src = {admin} alt = "Admin panel" />     Admin
								</NavItem>
								: null
							}
						</Nav>
						<Nav pullRight>
							<NavItem eventKey={1} href="/logout">
								<img height = '30' width = '30' src = { logout } alt = "logout" /> Logout
							</NavItem>
						</Nav>
					</Navbar.Collapse>
				</Navbar>

				{this.state.tabContent}
			</div> // closing wrapper div
		);
	}
}
