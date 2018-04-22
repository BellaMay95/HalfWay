import React, { Component } from 'react';
import {Glyphicon, Panel, PanelGroup,Button} from 'react-bootstrap';
import { app } from '../base';
import './ForumComponent.css';
import './ResourceComponent.css';

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

  render(){
    let resourceId = "delResource" + this.props.resIdentifier + "-" + this.props.index;
    return(
      <PanelGroup key={this.state.thread_id} id={this.state.thread_id}>
          <Panel bsStyle="info">
              <Panel.Heading>
                  <Panel.Title componentClass='h3'><div className = "h"><strong>{this.state.subject}</strong></div> <div className = "timestamp"> <strong>Date Posted: </strong>{this.state.timestamp}</div> <div class="clearfix"></div></Panel.Title>
              </Panel.Heading>
              <Panel.Body className = "body">{this.state.message}</Panel.Body>
              <Panel.Footer className = "footer">
                <div>
                { this.state.admin ?
                <Button className="deleteResource" id={resourceId} bsStyle="link" onClick={this.removeResource}>
                  <Glyphicon glyph="minus-sign"/>
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
