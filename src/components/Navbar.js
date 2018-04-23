import React, { Component } from 'react';
//import { render } from 'react-dom';
//import forum from '../images/forum.png';
//import directmessage from '../images/directmessage.png';
//import help from '../images/help.png';
//import settings from '../images/settings.png';
import logout from '../images/logout.png';
import logo from '../images/HWtrial21.png';
//import admin from '../images/usersecret.png';
import './Navbar.css';

import { Navbar, Nav, NavItem, /*OverlayTrigger, Tooltip*/ } from 'react-bootstrap';
//import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import { app } from '../base';

import ForumList from './ForumList';
import AdminPanel from './AdminPanel';
import Resources from './Resources';
import ViewProfile from './ViewProfile';


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
			//console.log("I'm an admin!")
			this.setState({ admin: result });
		})
		.catch((err) => {
			//if there was an error checking privileges, set to false
			//console.log("I'm not an admin!");
			this.setState({ admin: false });
		});

		/*let user = app.auth().currentUser;
		if (user) {
			let username = user.email.substr(0, user.email.indexOf('@'));
			console.log(user.displayName);
			this.setState({
				displayName: user.displayName,
				userName: username,
				avatarUrl: user.photoURL
			});
		}*/
  	}

  	checkAdmin() {
		//check user token for account type
		return app.auth().currentUser.getIdToken()
        .then((idToken) => {
            // Parse the ID token.
            idToken = idToken.replace(/-/g, "+").replace(/_/g, "/");
			const payload = JSON.parse(atob(idToken.split('.')[1]));
			if (payload['type'] === "admin") {
				return true;
			} else {
				return false;
			}
		})
		.catch((err) => {
			console.log("couldn't get token!");
			console.log(err);
			return false; //if we can't determine, say they aren't an admin
		})
  	}

	render() {
		//console.log("Admin: " + this.state.admin);
		/*const forumTooltip = (
			<Tooltip id="tooltip">Forums</Tooltip>
		);*/

		/*const messageTooltip = (
			<Tooltip id="tooltip">Messages</Tooltip>
		);*/

		/*const settingTooltip = (
			<Tooltip id="tooltip">Profiles & Settings</Tooltip>
		);

		const resourceTooltip = (
			<Tooltip id="tooltip">Resources</Tooltip>
		);

		const adminTooltip = (
			<Tooltip id="tooltip">Admin Panel</Tooltip>
		);*/

		return (
			<div>
				<Navbar collapseOnSelect className = "navbar">
					<Navbar.Header>
						<Navbar.Brand className = "logo">
							<a href="/" style={{padding: 3}}>< img height = '55px' width = '55px' src = {logo} alt = "HalfWay logo" /></a>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							<NavItem id="forum" eventKey={1} onSelect={() => {this.setState({tabContent: <ForumList />})}}>
								Forum
							</NavItem>
							<NavItem id="settings" eventKey={3} onSelect={() => {this.setState({tabContent: <ViewProfile />})}}>
								Profiles & Settings
							</NavItem>
							<NavItem id="resources" eventKey={4} onSelect={() => {this.setState({tabContent: <Resources />})}}>
								Resources
							</NavItem>
							{ this.state.admin ?
								<NavItem id="admin" eventKey={5} onSelect={() => {this.setState({tabContent: <AdminPanel />})}}>
									Admin
								</NavItem>
								: null
							}
						</Nav>
						<Nav pullRight>
							<NavItem eventKey={1} href="/logout" id = "logout">
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
