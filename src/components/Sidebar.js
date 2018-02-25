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


export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.checkAdmin = this.checkAdmin.bind(this);
		this.state = {
			tabList: null
		}
	}

	checkAdmin() {
		if (!app.auth().currentUser) {
			return "not logged in!";
		}
		let uid = app.auth().currentUser.uid;
		return app.database().ref('/users/' + uid).once('value').then(function(snapshot) {
			if (snapshot.val().admin) {
				return (
					<TabList>
					<img id = 'logo' height = '80' width = '80' src = {logo} alt = "site logo" />
					<Tab tabFor="vertical-tab-one"><img height = '50' width = '50' src = {forum} alt = "forum"/></Tab>
					<Tab tabFor="vertical-tab-two"><img height = '50' width = '50' src = {directmessage} alt = "messages" /></Tab>
					<Tab tabFor="vertical-tab-three"><img height = '50' width = '50' src = {help} alt = "help" /></Tab>
					<Tab tabFor="vertical-tab-four"><img  height = '50' width = '50' src = {settings} alt = "settings" /></Tab>
					<Tab tabFor="vertical-tab-six"><img height = '50' width = '50' src = {admin} alt = "admin panel" /></Tab>
					<Tab tabFor="vertical-tab-five"><a href="/logout"><img height = '50' width = '50' src = {logout} alt = "logout" /></a></Tab>
					</TabList>
				);
			}
			else {
				return ( <TabList>
					<img id = 'logo' height = '80' width = '80' src = {logo} alt = "site logo" />
					<Tab tabFor="vertical-tab-one"><img height = '50' width = '50' src = {forum} alt = "forum" /></Tab>
					<Tab tabFor="vertical-tab-two"><img height = '50' width = '50' src = {directmessage} alt = "messages" /></Tab>
					<Tab tabFor="vertical-tab-three"><img height = '50' width = '50' src = {help} alt = "help" /></Tab>
					<Tab tabFor="vertical-tab-four"><img  height = '50' width = '50' src = {settings} alt = "settings" /></Tab>
					<Tab tabFor="vertical-tab-five"><a href="/logout"><img height = '50' width = '50' src = {logout} alt = "logout" /></a></Tab>
					</TabList>
				);
			}
		});
  	}
  
	render() {
		if (!this.state.tabList) {
			this.checkAdmin().then((result) => {
				this.setState({tabList: result});
			});
		}

		return (

		<div>
		
		<Tabs
			defaultTab="vertical-tab-one"
			vertical
		>
			{this.state.tabList}
			<TabPanel tabId="vertical-tab-one">
				<Forums />
			</TabPanel>
			<TabPanel tabId="vertical-tab-two">
			<p>Messages</p>
			</TabPanel>
			<TabPanel tabId="vertical-tab-three">
			<p>Help</p>
			</TabPanel>
			<TabPanel tabId="vertical-tab-four">
			<p>Settings</p>
			</TabPanel>
			<TabPanel tabId="vertical-tab-six">
				<p>Admin Panel</p>
			</TabPanel>
		</Tabs>
		</div>
		);
	}
}