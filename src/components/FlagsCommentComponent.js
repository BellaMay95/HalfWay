import React, { Component } from 'react';
import {Glyphicon, Panel, PanelGroup, Button} from 'react-bootstrap';
import { app } from '../base';
import './ForumComponent.css';
import './FlagsComponent.css';

class ForumComponent extends Component{
  constructor(props){
      super(props);
      this.removeComment = this.removeComment.bind(this);
      this.keepComment = this.keepComment.bind(this);
      this.databaseOfFlagsC = app.database().ref().child('flaggedComments');
      this.databaseOfPosts = app.database().ref().child('forum');

      this.state = {
        flagged_id: props.flagged_id,
        thread_id: props.thread_id,
        thread_userName: props.thread_userName,
        reason_message: props.reason_message,
        thread_message: props.thread_message,
        comment_id: props.comment_id,
        comment_message: props.comment_message,

      }
  }

  removeComment(thread_id, flagged_id, comment_id){

    this.databaseOfFlagsC.child(this.props.flagged_id).remove()
    .then(() => {
      this.databaseOfPosts.child(this.props.thread_id).child('comments').child(this.props.comment_id).remove()
      .then(() => {
        this.props.showAlert("Comment Removed Successfully!", "success");
      })
      .catch((err) => {
        this.props.showAlert("Error Removing Comment from Database!", "danger");
      })
    })
    .catch((err) => {
      console.log("error removing comment from flags table");
      console.log(err);
      this.props.showAlert("Error Removing Flag from Comment!", "danger");
    })
    //alert("Post removed.");
  }

  keepComment(flagged_id){
    console.log("keeping comment")
    this.databaseOfFlagsC.child(this.props.flagged_id).remove()
    .then(() => {
      console.log("ready to show alert!");
      this.props.showAlert("Removed Flag from Comment!", "success");
    })
    .catch((err) => {
      console.log("Error removing flag from comment!");
      console.log(err);
      this.props.showAlert("Error Removing Flag from Comment!", "danger");
    });
    //alert("Post kept.");
  }

  render(){
    let commentId = "flagComment" + this.props.id;
    let acceptId = "acceptComment" + this.props.id;
    let rejectId = "rejectComment" + this.props.id;
    return(
      <div id = "flag">
      <PanelGroup key={this.state.thread_id} id={commentId}>
          <Panel bsStyle="danger">
              <Panel.Heading>
                  <Panel.Title componentClass='h3' className = "flagTitle"><strong>Flagged user:</strong> {this.state.thread_userName} </Panel.Title>
              </Panel.Heading>
              <Panel.Body className = "flagBody"><strong>Reason:</strong> {this.state.reason_message} <br/><strong>Original Post:</strong> {this.state.thread_message}<br/><strong>Comment: </strong>{this.state.comment_message}</Panel.Body>
              <Panel.Footer>
                <div>
                <Button className="deleteComment" id={rejectId} bsStyle="danger" onClick={this.removeComment}>
                  <Glyphicon glyph="minus-sign" style={{padding: ''}}/>
                  Remove Comment
                </Button>
                <Button className="keepComment" id={acceptId} bsStyle="success" onClick={this.keepComment}>
                  <Glyphicon glyph="plus-sign" style={{padding: ''}}/>
                  Accept Comment
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
