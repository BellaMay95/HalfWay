
import React, { Component } from 'react';
import { render } from 'react-dom';
import forum from '../images/forum.png';
import directmessage from '../images/directmessage.png';
import help from '../images/help.png';
import settings from '../images/settings.png';
import logout from '../images/logout.png';
import logo from '../images/HWtrial2.png';
import admin from '../images/usersecret.png';

import './navbar.css';
import { app } from '../base';

import ForumList from './ForumList';
import AdminPanel from './AdminPanel';


export default class Navbar extends Component {
  constructor() {
    super();
    this.checkAdmin = this.checkAdmin.bind(this);
    this.state = {
      tabList: null
    }
  }

  checkAdmin() {
		//if user isn't logged in, just return nothing
		/*if (app.auth().currentUser && !app.auth().currentUser) {
			return "not logged in!";
    }*/
		//get user ID for lookup in database table
		let uid = app.auth().currentUser.uid;
		return app.database().ref('/users/' + uid).once('value').then(function(snapshot) {
			//if the user has admin privileges, return this set of tabs
			if (snapshot.val().admin) {
				return (
          <ul class="nav navbar-nav">
            <li><a data-toggle="tab"  href="#forum" ><img height = '55' width = '55' src = {forum}/>     Forum</a></li>
            <li><a data-toggle="tab"  href="#directmessage"><img height = '55' width = '55' src = {directmessage}/>     Direct Message</a></li>
            <li><a data-toggle="tab"  href="#help" data-toggle="tab" ><img height = '55' width = '55' src = {help}/>     Help</a></li>
            <li><a data-toggle="tab"  href="#settings" data-toggle="tab" ><img height = '55' width = '55' src = {settings}/>     Settings</a></li>
            <li><a data-toggle="tab"  href="#admin" data-toggle="tab" ><img height = '55' width = '55' src = {admin}/> Admin Panel</a></li>
          </ul>
				);
			}
			//otherwise return this set of tabs
			else {
				return (
          <ul class="nav navbar-nav">
            <li><a data-toggle="tab"  href="#forum" ><img height = '55' width = '55' src = {forum}/>     Forum</a></li>
            <li><a data-toggle="tab"  href="#directmessage"><img height = '55' width = '55' src = {directmessage}/>     Direct Message</a></li>
            <li><a data-toggle="tab"  href="#help" data-toggle="tab" ><img height = '55' width = '55' src = {help}/>     Help</a></li>
            <li><a data-toggle="tab"  href="#settings" data-toggle="tab" ><img height = '55' width = '55' src = {settings}/>     Settings</a></li>
          </ul>
        )  ;
			}
		});
  	}

  render() {
    //first check to see user is logged in
    //if the state of tablist is empty, check for admin privileges then load
    if (!this.state.tabList) {
			this.checkAdmin().then((result) => {
				//set the state of the tablist based on what function returned so React can reload
				this.setState({tabList: result});
			});
		}

    return (

      <div>

      <nav class="navbar">
        <div class="container-fluid">
          <div class="navbar-header">
            {/*<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>*/}
            <a class="navbar-brand" href="#"> < img height = '75px' width = '75px' src = {logo} /> </a>
          </div>
          <div class="collapse navbar-collapse" id="myNavbar">
          {this.state.tabList}
          <ul class="nav navbar-nav navbar-right">
            {/*Need to reset this.state.tabList back to "null" before changing the route!*/}
            <li><a href="/logout"><span class="glyphicon glyphicon-log-in"></span> Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="tab-content" >
      <div id="forum" class="tab-pane fade in active">
        <ForumList />
      </div>

      <div id="directmessage" class="tab-pane fade">
        <p>These are the contents of Services </p>
      </div>

      <div id="help" class="tab-pane fade">
        <p>These are the contents of About us </p>
      </div>

      <div id="settings" class="tab-pane fade">
        <p>These are the contents of Contact us </p>
      </div>

      <div id="admin" class="tab-pane fade">
        <AdminPanel />
      </div>
    </div>

    </div> // closing wrapper div
    );
  }
}
