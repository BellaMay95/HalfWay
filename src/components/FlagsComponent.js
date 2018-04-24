import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import {Glyphicon, Panel, PanelGroup, Button } from 'react-bootstrap';
import { app } from '../base';
import './ForumComponent.css';
import './FlagsComponent.css';

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

    this.databaseOfFlags.child(this.props.flagged_id).remove()
    .then(() => {
      this.databaseOfPosts.child(this.props.thread_id).remove()
      .then(() => {
        this.props.showAlert("Removed Post Successfully!");
        //ReactDOM.unmountComponentAtNode(document.getElementById('flag'));
      })
      .catch((err) => {
        console.log("error removing post from database!");
        console.log(err);
        this.props.showAlert("Error Removing Post!", "danger");
      })
    })
    .catch((err) => {
      console.log("error removing post from flags table");
      console.log(err);
      this.props.showAlert("Error Removing Flag from Post!", "danger");
    })

    //alert("Post removed.");
  }

  keepPost(flagged_id){
    this.databaseOfFlags.child(this.props.flagged_id).remove()
    .then(() => {
      this.props.showAlert("Removed Flag from Post!", "success");
    })
    .catch((err) => {
      console.log("error removing flag from post");
      console.log(err);
      this.props.showAlert("Error Removing Flag from Post!", "danger");
    })
    //alert("Post kept.");
  }

  render(){
    let forumId = "flagPost" + this.props.id;
    let acceptId = "acceptPost" + this.props.id;
    let rejectId = "rejectPost" + this.props.id;
    return(
      <div id = "flag">
      <PanelGroup key={this.state.thread_id} id={forumId}>
          <Panel bsStyle="danger">
              <Panel.Heading>
                  <Panel.Title componentClass='h3' className = "flagTitle"><strong>Flagged user:</strong> {this.state.thread_userName} </Panel.Title>
              </Panel.Heading>
              <Panel.Body className = "flagBody"><strong>Reason:</strong> {this.state.reason_message}<br/><strong>Post: </strong>{this.state.thread_message}</Panel.Body>
              <Panel.Footer>
                <div>
                <Button className="deletePost" id={rejectId} bsStyle="danger" onClick={this.removePost}>
                  <Glyphicon glyph="minus-sign" style={{padding: ''}}/>
                  Remove Post
                </Button>
                <Button className="keepPost" id={acceptId} bsStyle="success" onClick={this.keepPost}>
                  <Glyphicon glyph="plus-sign" style={{padding: ''}}/>
                  Accept Post
                </Button>
                </div>
                <div className="clearfix"></div>
              </Panel.Footer>
          </Panel>
      </PanelGroup>
      </div>
    )
  }
}

export default ForumComponent;
