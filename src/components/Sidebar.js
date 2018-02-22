import React, { Component } from 'react';
import { render } from 'react-dom';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';
import forum from '../images/forum.png';
import directmessage from '../images/directmessage.png';
import help from '../images/help.png';
import settings from '../images/settings.png';
import logout from '../images/logout.png';
import logo from '../images/HWtrial2.png';


export default class Sidebar extends Component {
  render() {
    return (

      <div>
      <img id = 'logo' height = '118' width = '115' src = {logo} pullLeft/>
      <Tabs
        defaultTab="vertical-tab-one"
        vertical>

        <TabList>
          <Tab tabFor="vertical-tab-one"><img height = '50' width = '50' src = {forum}/></Tab>
          <Tab tabFor="vertical-tab-two"><img height = '50' width = '50' src = {directmessage}/></Tab>
          <Tab tabFor="vertical-tab-three"><img height = '50' width = '50' src = {help}/></Tab>
          <Tab tabFor="vertical-tab-four"><img  height = '50' width = '50' src = {settings}/></Tab>
          <Tab tabFor="vertical-tab-five"><a href="/logout"><img height = '50' width = '50' src = {logout}/></a></Tab>
        </TabList>
        <TabPanel tabId="vertical-tab-one">
          <p>Discussions</p>
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
      </Tabs>
      </div>
    );
  }
}