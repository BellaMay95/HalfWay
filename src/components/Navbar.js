
import React, { Component } from 'react';
import { render } from 'react-dom';
import forum from '../images/forum.png';
import directmessage from '../images/directmessage.png';
import help from '../images/help.png';
import settings from '../images/settings.png';
import logout from '../images/logout.png';
import logo from '../images/HWtrial2.png';

import './navbar.css';

import ForumList from './ForumList';


export default class Navbar extends Component {
  render() {
    return (

      <div>

      <nav class="navbar navbar-inverse">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#"> < img height = '75px' width = '75px' src = {logo} /> </a>
          </div>
          <div class="collapse navbar-collapse" id="myNavbar">
          <ul class="nav navbar-nav">
            <li><a data-toggle="tab"  href="#forum" ><img height = '55' width = '55' src = {forum}/>     Forum</a></li>
            <li><a data-toggle="tab"  href="#directmessage"><img height = '55' width = '55' src = {directmessage}/>     Direct Message</a></li>
            <li><a data-toggle="tab"  href="#help" data-toggle="tab" ><img height = '55' width = '55' src = {help}/>     Help</a></li>
            <li><a data-toggle="tab"  href="#settings" data-toggle="tab" ><img height = '55' width = '55' src = {settings}/>     Settings</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
            <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Logout</a></li>
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
    </div>

    </div> // closing wrapper div
    );
  }
}
