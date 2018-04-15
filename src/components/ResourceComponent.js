import React, { Component } from 'react';
import {Glyphicon, Panel, PanelGroup,Button} from 'react-bootstrap';
import { app } from '../base';
import './ForumComponent.css';

class ForumComponent extends Component{
  constructor(props){
      super(props);
      this.checkAdmin = this.checkAdmin.bind(this);
      this.removeResource = this.removeResource.bind(this);

      this.database = app.database().ref().child('resources');
      this.state = {
        createAlert: null,
        resource_id: props.resource_id,
        author_name: props.author_name,
        subject: props.subject,
        timestamp: props.timestamp,
        message: props.message,
        resIdentifier: props.resIdentifier,
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


  removeResource(resource_id,resIdentifier){
    if(this.props.resIdentifier === 1)
    {
      this.database.child('job').child(this.props.resource_id).remove();
    }
    if(this.props.resIdentifier === 2)
    {
      this.database.child('affordablehousing').child(this.props.resource_id).remove();
    }
    if(this.props.resIdentifier === 3)
    {
      this.database.child('shorttermhousing').child(this.props.resource_id).remove();
    }
    if(this.props.resIdentifier === 4)
    {
      this.database.child('food').child(this.props.resource_id).remove();
    }
    if(this.props.resIdentifier === 5)
    {
      this.database.child('education').child(this.props.resource_id).remove();
    }
    alert("Resource removed succesfully! Refresh to see changes.")

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
                  <Panel.Title componentClass='h3'>{this.state.subject} : {this.state.timestamp} : {this.state.resource_id} </Panel.Title>
              </Panel.Heading>
              <Panel.Body>{this.state.message}</Panel.Body>
              <Panel.Footer>
                <div>
                { this.state.admin ?
                <Button className="deleteResource" bsStyle="link" onClick={this.removeResource}>
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
