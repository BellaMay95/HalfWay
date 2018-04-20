import React, { Component } from 'react';
import {Glyphicon, Panel, PanelGroup, Button, Image } from 'react-bootstrap';
import './ForumComponent.css';
import warning from '../images/warning.png';
//import CreateComment from './CreateComment';

class ForumComponent extends Component{
  constructor(props){
      super(props);
      this.handleOpenCreateCommentModal = this.handleOpenCreateCommentModal.bind(this);
      this.handleOpenViewCommentModal = this.handleOpenViewCommentModal.bind(this);
      this.handleOpenFlagForumModal= this.handleOpenFlagForumModal.bind(this);

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
    this.props.toggleViewCommentModal(this.state.thread_id, this.state.message, this.state.author_name);
  }

  // Calls the toggleFlagForumPost function in ForumList.js
  handleOpenFlagForumModal(){
    this.props.toggleFlagForumPost(this.state.thread_id, this.state.message, this.state.author_name);
  }

  render(){
    return(
      <div>
      <PanelGroup bsStyle="primary" key={this.state.thread_id} id={this.state.thread_id}>
          <Panel>
              <Panel.Heading>
                  <div>

                    <Panel.Title className="PanelTitle" componentClass='h3'>
                      <div>
                        {this.state.subject}
                      </div>
                    </Panel.Title>

                    <Button className="newComment" bsStyle="link" onClick={() => this.handleOpenCreateCommentModal()}>
                      {/* I will need to pass the id of the thread to the toggleModal prop eventually*/}
                      <Glyphicon glyph="plus-sign" style={{padding: '5px'}}/>
                      Create Comment
                    </Button>

                  </div>
                  <div className="clearfix"></div>
              </Panel.Heading>
              <Panel.Body>
                <div>
                  <p>{this.state.message}</p>
                  <p className="cite"><cite>Author: {this.state.author_name}</cite></p>
                </div>
              </Panel.Body>
              <Panel.Footer>
                <div>

                <Button className="viewComments" bsStyle="link" onClick={() => this.handleOpenViewCommentModal()}>
                  View Comments
                </Button>

                <div>
                  {/*<a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>*/}
                  <Image className="warningSign" src={warning} responsive onClick={() => this.handleOpenFlagForumModal()}/>
                </div>

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
