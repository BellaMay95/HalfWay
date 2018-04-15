import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Glyphicon, Panel, PanelGroup, Button } from 'react-bootstrap';
import { app } from '../base';
import './ForumComponent.css';

class ForumComponent extends Component{
  constructor(props){
      super(props);
      this.removePost = this.removePost.bind(this);
      this.keepPost = this.keepPost.bind(this);
      this.databaseOfFlags = app.database().ref().child('flaggedForum');
      this.databaseOfPosts = app.database().ref().child('forum');

      this.state = {
        flagged_id: props.flagged_id,
        thread_id: props.thread_id,
        thread_userName: props.thread_userName,
        reason_message: props.reason_message,
        thread_message: props.thread_message,
      }
  }

  removePost(thread_id, flagged_id){

    this.databaseOfFlags.child(this.props.flagged_id).remove();
    this.databaseOfPosts.child(this.props.thread_id).remove();

    alert("Post removed.");
    ReactDOM.unmountComponentAtNode(document.getElementById('flag'));
  }

  keepPost(flagged_id){
    this.databaseOfFlags.child(this.props.flagged_id).remove();
    alert("Post kept.");
  }

  render(){
    return(
      <div id = "flag">
      <PanelGroup key={this.state.thread_id} id={this.state.thread_id}>
          <Panel>
              <Panel.Heading>
                  <Panel.Title componentClass='h3'>Flagged user: {this.state.thread_userName} <br/>Reason: {this.state.reason_message} </Panel.Title>
              </Panel.Heading>
              <Panel.Body>{this.state.thread_message}</Panel.Body>
              <Panel.Footer>
                <div>
                <Button className="deletePost" bsStyle="danger" onClick={this.removePost}>
                  <Glyphicon glyph="minus-sign" style={{padding: '5px'}}/>
                  Remove Post
                </Button>
                <Button className="keepPost" bsStyle="success" onClick={this.keepPost}>
                  <Glyphicon glyph="plus-sign" style={{padding: '5px'}}/>
                  Accept Post
                </Button>
                </div>
                <div class="clearfix"></div>
              </Panel.Footer>
          </Panel>
      </PanelGroup>
      </div>
    )
  }
}

export default ForumComponent;
