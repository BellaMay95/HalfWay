import React, { Component } from 'react';
//import { render } from 'react-dom';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';
import forum from '../images/forum.png';
import directmessage from '../images/directmessage.png';
import help from '../images/help.png';
import settings from '../images/settings.png';
import logout from '../images/logout.png';
import logo from '../images/HWtrial2.png';
import admin from '../images/usersecret.png';

import { app } from '../base';
import Forums from './ForumList';
import AdminPanel from './AdminPanel';
import Resources from './Resources';


export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.checkAdmin = this.checkAdmin.bind(this);
		this.state = {
			admin: false
		};
	}

	componentWillMount() {
		//checks for admin privileges before rendering component
		this.checkAdmin()
		.then((result) => {
			//set admin state based on result of check
			this.setState({ admin: result });
		})
		.catch((err) => {
			//if there was an error checking privileges, set to false
			this.setState({ admin: false });
		})
	}

	checkAdmin() {
		//get user ID for lookup in database table
		let user = app.auth().currentUser;
		if (!user) {
			return false;
		}
		let uid = app.auth().currentUser.uid;
		return app.database().ref('/users/' + uid).once('value').then(function(snapshot) {
			//if the user has admin privileges, set state
			if (snapshot.val().type === "admin") {
				return true;
			}
			//otherwise make sure admin state is false
			else {
				return false;
			}
		});
  	}

	render() {
		return (
			<Tabs
				defaultTab="vertical-tab-one"
				vertical
			>
				<TabList>
					<a href="/"><img id = 'logo' style={{height: '80px', width: '80px', "paddingLeft": '5px'}} src = {logo} alt = "site logo" /></a>
					<Tab tabFor="vertical-tab-one"><img height = '50' width = '50' src = {forum} alt = "forum"/></Tab>
					<Tab tabFor="vertical-tab-two"><img height = '50' width = '50' src = {directmessage} alt = "messages" /></Tab>
					<Tab tabFor="vertical-tab-three"><img height = '50' width = '50' src = {help} alt = "help" /></Tab>
					<Tab tabFor="vertical-tab-four"><img  height = '50' width = '50' src = {settings} alt = "settings" /></Tab>
					{ this.state.admin ? <Tab tabFor="vertical-tab-six"><img height = '50' width = '50' src = {admin} alt = "admin panel" /></Tab> : null }
					<Tab tabFor="vertical-tab-five"><a href="/logout"><img height = '50' width = '50' src = {logout} alt = "logout" /></a></Tab>
				</TabList>

				{/*sets what is shown when each tab is selected*/}
				<TabPanel tabId="vertical-tab-one">
					<Forums />
				</TabPanel>
				<TabPanel tabId="vertical-tab-two">
					<p>Messages</p>
				</TabPanel>
				<TabPanel tabId="vertical-tab-three">
					<Resources />
				</TabPanel>
				<TabPanel tabId="vertical-tab-four">
					<p>Settings</p>
				</TabPanel>
				{ this.state.admin ? <TabPanel tabId="vertical-tab-six"><AdminPanel /></TabPanel> : null }
			</Tabs>
		);
	}
}
