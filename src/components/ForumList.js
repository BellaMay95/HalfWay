import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Glyphicon, Panel, PanelGroup, Well } from 'react-bootstrap';
import { app } from '../base';
import ForumComponent from './ForumComponent';

import CreateThread from './CreateThread';

class Forum extends Component {
    constructor(props) {
        super(props);
        this.toggleThreadModal = this.toggleThreadModal.bind(this);

    // Make a referance to a database on firebase //list of notes stored on db property
    // app refers to our application
    // database refers to get us reference to the location we will be writing queries
    // notes child will be used to store instances of our notes child
      this.database = app.database().ref().child('forum');

    // We are going to set up the react state of our components
        this.state = {
            createThread: false,
            forumList: [],
        }
    }

    // Will mount happens after initialization but before the render (for more information look up the lifecycles of react components)
    componentWillMount(){
      const prevForum = this.state.forumList;  // Set previousForum to current state

      // Get DataSnapshot every time a child is added to the array
      this.database.on('child_added', snap => {
        prevForum.push({
          id: snap.key,
          author_id: snap.val().author_id,
          author_name: snap.val().author_name,
          message: snap.val().message,
          subject: snap.val().subject,
          timestamp: snap.val().timestamp,
        })

        // Push the array that we have just updated (previousForum) to the state
        this.setState({
          forumList: prevForum
        })
      })
    }

    toggleThreadModal() {
        this.setState({createThread: !this.state.createThread});
    }

    render() {
        let headerStyle = {
            fontFamily: "'Courier New', 'Courier', 'monospace'",
            fontSize: 36,
            fontWeight: "bold"
        }

        return (
            <div className="container">
                <Navbar collapseOnSelect style={{marginTop: '5px'}}>
                    <Navbar.Header>
                        <Navbar.Brand style={headerStyle}>Forums</Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem eventKey={1} onClick={this.toggleThreadModal}>
                                Create New Thread
                                <Glyphicon glyph="plus-sign" style={{padding: '5px'}}/>
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                {this.state.createThread && <CreateThread closeThreadModal={this.toggleThreadModal}/>}

                <div className='forumBody'>
                    {   //displays message if there aren't any forum threads to display
                        this.state.forumList.length === 0 ?
                            <Well id="emptyMessage">No threads yet! Be the first to start the conversation!</Well>
                        : null
                    }

                    {

                    /* Going through the array and displaying all of the forums in a panel view*/
                    this.state.forumList.map((forum, index) => {
                        let thread_id = "thread_" + index;
                        return(
                          <ForumComponent thread_id={thread_id} author_name={forum.author_name} subject={forum.subject} timestamp={forum.timestamp} message={forum.message} />
                        )
                    })
                    }
               </div>

            </div>
        )
    }
}

export default Forum;
