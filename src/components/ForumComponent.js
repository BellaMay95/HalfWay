import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Glyphicon, Panel, PanelGroup, Well, Button } from 'react-bootstrap';
import './ForumComponent.css';

class ForumComponent extends Component{
  constructor(props){
      super(props);
      this.state = {
        thread_id: props.thread_id,
        author_name: props.author_name,
        subject: props.subject,
        timestamp: props.timestamp,
        message: props.message,
      }
  }

  render(){
    return(
      <PanelGroup key={this.state.thread_id} id={this.state.thread_id}>
          <Panel>
              <Panel.Heading>
                  <Panel.Title componentClass='h3'>{this.state.author_name} : {this.state.subject} : {this.state.timestamp} </Panel.Title>
              </Panel.Heading>
              <Panel.Body>{this.state.message}</Panel.Body>
              <Panel.Footer>
                <div>
                <Button className="newComment" bsStyle="link">
                  <Glyphicon glyph="plus-sign" style={{padding: '5px'}}/>
                  Create Comment
                </Button>
                <Button className="viewComments">
                  View Comments
                </Button>
                </div>
                <div class="clearfix"></div>
              </Panel.Footer>
          </Panel>
      </PanelGroup>
    )
  }
}

export default ForumComponent;
