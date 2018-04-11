import React, { Component } from 'react';
import {Glyphicon, Panel, PanelGroup, Button } from 'react-bootstrap';
import './ForumComponent.css';
//import CreateComment from './CreateComment';

class ForumComponent extends Component{
  constructor(props){
      super(props);
      this.handleOpenCreateCommentModal = this.handleOpenCreateCommentModal.bind(this);
      this.state = {
        thread_id: props.thread_id,
        author_name: props.author_name,
        subject: props.subject,
        timestamp: props.timestamp,
        message: props.message,
      }
  }

  // Calls the toggleCreateCommentModal function in ForumList.js
  handleOpenCreateCommentModal(){
    this.props.toggleCreateCommentModal(this.state.thread_id);
  }

  // Calls the toggleViewCommentModal function in ForumList.js
  handleOpenViewCommentModal(){
    console.log("ForumComponent:: Inside toggleViewCommentModal");
    this.props.toggleViewCommentModal(this.state.thread_id);
  }

  render(){
    return(
      <div>
      <PanelGroup key={this.state.thread_id} id={this.state.thread_id}>
          <Panel>
              <Panel.Heading>
                  <Panel.Title componentClass='h3'>{this.state.author_name} : {this.state.subject} : {this.state.thread_id} </Panel.Title>
              </Panel.Heading>
              <Panel.Body>{this.state.message}</Panel.Body>
              <Panel.Footer>
                <div>
                <Button className="newComment" bsStyle="link" onClick={() => this.handleOpenCreateCommentModal()}>
                  {/* I will need to pass the id of the thread to the toggleModal prop eventually*/}
                  <Glyphicon glyph="plus-sign" style={{padding: '5px'}}/>
                  Create Comment
                </Button>
                <Button className="viewComments" onClick={() => this.handleOpenViewCommentModal()}>
                  View Comments
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
