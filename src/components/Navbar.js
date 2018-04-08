import React, { Component } from 'react';
//import { render } from 'react-dom';
import forum from '../images/forum.png';
import directmessage from '../images/directmessage.png';
import help from '../images/help.png';
import settings from '../images/settings.png';
import logout from '../images/logout.png';
import logo from '../images/HWtrial2.png';
import admin from '../images/usersecret.png';

import { Navbar, Nav, NavItem, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
	  admin: false,
	  displayName: null,
	  userName: null,
	  avatarUrl: null
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
		//console.log("Admin: " + this.state.admin);
		const forumTooltip = (
			<Tooltip id="tooltip">Forums</Tooltip>
		);

		/*const messageTooltip = (
			<Tooltip id="tooltip">Messages</Tooltip>
		);*/

		const settingTooltip = (
			<Tooltip id="tooltip">Profiles & Settings</Tooltip>
		);

		const resourceTooltip = (
			<Tooltip id="tooltip">Resources</Tooltip>
		);

		const adminTooltip = (
			<Tooltip id="tooltip">Admin Panel</Tooltip>
		);

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
							<NavItem id="forum" eventKey={1} onSelect={() => {this.setState({tabContent: <ForumList />})}}>
								<OverlayTrigger placement="bottom" overlay={forumTooltip}><img height = '30' width = '30' src = {forum} alt = "Forum" /></OverlayTrigger>
							</NavItem>
							{/*<NavItem id="message" eventKey={2} onSelect={() => {this.setState({tabContent: "direct message component here"})}}>
								<OverlayTrigger placement="bottom" overlay={messageTooltip}><img height = '30' width = '30' src = {directmessage} alt = "Direct message" /></OverlayTrigger>
							</NavItem>*/}
							<NavItem id="settings" eventKey={3} onSelect={() => {this.setState({tabContent: <ViewProfile />})}}>
								<OverlayTrigger placement="bottom" overlay={settingTooltip}><img height = '30' width = '30' src = {settings} alt = "User settings" /></OverlayTrigger>
							</NavItem>
							<NavItem id="resources" eventKey={4} onSelect={() => {this.setState({tabContent: <Resources />})}}>
							<OverlayTrigger placement="bottom" overlay={resourceTooltip}><img height = '30' width = '30' src = {help} alt = "Resources page" /></OverlayTrigger>
							</NavItem>
							{ this.state.admin ?
								<NavItem id="admin" eventKey={5} onSelect={() => {this.setState({tabContent: <AdminPanel />})}}>
									<OverlayTrigger placement="bottom" overlay={adminTooltip}><img height = '30' width = '30' src = {admin} alt = "Admin panel" /></OverlayTrigger>
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
