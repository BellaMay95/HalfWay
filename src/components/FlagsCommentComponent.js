import React, { Component } from 'react';
import {Glyphicon, Panel, PanelGroup, Button} from 'react-bootstrap';
import { app } from '../base';
import './ForumComponent.css';

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

    this.databaseOfFlagsC.child(this.props.flagged_id).remove();
    this.databaseOfPosts.child(this.props.thread_id).child('comments').child(this.props.comment_id).remove();

    alert("Post removed.");

  }

  keepComment(flagged_id){
    this.databaseOfFlagsC.child(this.props.flagged_id).remove();
    alert("Post kept.");
  }

  render(){
    return(
      <div id = "flag">
      <PanelGroup key={this.state.thread_id} id={this.state.thread_id}>
          <Panel>
              <Panel.Heading>
                  <Panel.Title componentClass='h3'>Flagged user: {this.state.thread_userName} <br/>Reason: {this.state.reason_message} <br/>Original Post: {this.state.thread_message} </Panel.Title>
              </Panel.Heading>
              <Panel.Body>{this.state.comment_message}</Panel.Body>
              <Panel.Footer>
                <div>
                <Button className="deleteComment" bsStyle="danger" onClick={this.removeComment}>
                  <Glyphicon glyph="minus-sign" style={{padding: '5px'}}/>
                  Remove Comment
                </Button>
                <Button className="keepComment" bsStyle="success" onClick={this.keepComment}>
                  <Glyphicon glyph="plus-sign" style={{padding: '5px'}}/>
                  Accept Comment
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
