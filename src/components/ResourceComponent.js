import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Glyphicon, Panel, PanelGroup, Well, Button } from 'react-bootstrap';
import { app } from '../base';
import './ForumComponent.css';

class ForumComponent extends Component{
  constructor(props){
      super(props);
      this.checkAdmin = this.checkAdmin.bind(this);
      this.state = {
        thread_id: props.thread_id,
        author_name: props.author_name,
        subject: props.subject,
        timestamp: props.timestamp,
        message: props.message,
      }
  }

  componentWillMount() {
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

  render(){
    return(
      <PanelGroup key={this.state.thread_id} id={this.state.thread_id}>
          <Panel>
              <Panel.Heading>
                  <Panel.Title componentClass='h3'>{this.state.subject} : {this.state.timestamp} </Panel.Title>
              </Panel.Heading>
              <Panel.Body>{this.state.message}</Panel.Body>
              <Panel.Footer>
                <div>
                { this.state.admin ?
                <Button className="deleteResource" bsStyle="link">
                  <Glyphicon glyph="minus-sign" style={{padding: '5px'}}/>
                  Remove Resource
                </Button> : null}
                </div>
                <div class="clearfix"></div>
              </Panel.Footer>
          </Panel>
      </PanelGroup>
    )
  }
}

export default ForumComponent;
