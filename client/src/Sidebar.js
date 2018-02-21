
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';
import forum from './forum.png';
import directmessage from './directmessage.png';
import help from './help.png';
import settings from './settings.png';
import logout from './logout.png';
import logo from './HWtrial2.png';


export default class Sidebar extends Component {
  render() {
    return (

      <div>
      <img id = 'logo' height = '118' width = '115' src = {logo}/>
      <Tabs
        defaultTab="vertical-tab-one"
        vertical>

        <TabList>
          <Tab tabFor="vertical-tab-one"><img height = '75' width = '75' src = {forum}/></Tab>
          <Tab tabFor="vertical-tab-two"><img height = '75' width = '75' src = {directmessage}/></Tab>
          <Tab tabFor="vertical-tab-three"><img height = '75' width = '75' src = {help}/></Tab>
          <Tab tabFor="vertical-tab-four"><img  height = '75' width = '75' src = {settings}/></Tab>
          <Tab tabFor="vertical-tab-five"><img height = '75' width = '75' src = {logout}/></Tab>
        </TabList>
        <TabPanel tabId="vertical-tab-one">
          <p><h1>Discussions</h1></p>
        </TabPanel>
        <TabPanel tabId="vertical-tab-two">
          <p> content</p>
        </TabPanel>
        <TabPanel tabId="vertical-tab-three">
          <p>Tab 3 content</p>
        </TabPanel>
      </Tabs>
      </div>
    );
  }
}
