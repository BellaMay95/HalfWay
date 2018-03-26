import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Glyphicon, Panel, PanelGroup, Well, Alert } from 'react-bootstrap';
import { app } from '../base';
import ForumComponent from './ForumComponent';
import CreateThread from './CreateThread';
import CreateComment from './CreateComment';

class Forum extends Component {
    constructor(props) {
        super(props);
        this.toggleThreadModal = this.toggleThreadModal.bind(this);
        this.createThreadAlert = this.createThreadAlert.bind(this);
        this.toggleCreateCommentModal = this.toggleCreateCommentModal.bind(this);

    // Make a reference to a database on firebase //list of notes stored on db property
    // app refers to our application
    // database refers to get us reference to the location we will be writing queries
    // notes child will be used to store instances of our notes child
      this.database = app.database().ref().child('forum');

    // We are going to set up the react state of our components
        this.state = {
            // Used to see and togle the thread or comment modal is up
            createThread: false,
            createAlert: null,
            createComment: false,
            viewComment: false,
            // Array that holds all of the Forums pulled from the database
            forumList: [],
            thread_id: null,
        }
    }

    // Will mount happens after initialization but before the render (for more information look up the lifecycles of react components)
    // This will be where the forumList array is filled in by pulling from the database
    componentWillMount(){
      var prevForum = this.state.forumList;  // Set previousForum to current state

      // Get DataSnapshot every time a child is added to the array
      // Push this new forum data onto the prevForum array
      this.database.on('child_added', snap => {
        prevForum.push({
          id: snap.key,
          author_id: snap.val().author_id,
          author_name: snap.val().author_name,
          message: snap.val().message,
          subject: snap.val().subject,
          key: snap.key,
          timestamp: this.getDateTime(snap.val().timestamp),
        })

        //reverse the array to show newest posts first
        prevForum = prevForum.reverse();
        // Push the array that we have just updated (previousForum) to the state
        //  Set forumList to the prevForum
        this.setState({
          forumList: prevForum
        })
      })
    }

    getDateTime(timestamp) {
        let DateObj = new Date(timestamp);
        let formattedDate = DateObj.toLocaleString();
        return formattedDate;
    }

    // Changes the state of the createThread to the opposite of what it is
    toggleThreadModal() {
        this.setState({
          createThread: !this.state.createThread
        });
    }

    createThreadAlert() {
        this.setState({ createAlert: <Alert bsStyle="success">Created Thread Successfully!</Alert>});

        window.setTimeout(() => {
            this.setState({ createAlert: null });
        }, 5000);
    }

    // Changes the state of the createComment to the opposite of what it is
    toggleCreateCommentModal(threadID){
      this.setState({
        createComment: !this.state.createComment,
        thread_id: threadID,
      });
    }

    // Changes the state of the viewComment to trigger whether the modal should be displayed
    toggleViewCommentModal(){
      this.setState({
        viewComment: !this.state.viewComment,
      })
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
                        <Navbar.Brand id="forumHeader" style={headerStyle}>Forums</Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem id="createThread" eventKey={1} onClick={this.toggleThreadModal}>
                                Create New Thread
                                <Glyphicon glyph="plus-sign" style={{padding: '5px'}}/>
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                {this.state.createThread && <CreateThread showAlert={this.createThreadAlert} closeThreadModal={this.toggleThreadModal}/>}
                {this.state.createAlert}

                <div className='forumBody'>
                    {   //displays message if there aren't any forum threads to display
                        this.state.forumList.length === 0 ?
                            <Well id="emptyMessage">No threads yet! Be the first to start the conversation!</Well>
                        : null
                    }
                    {
                      /* Going through the array and displaying all of the forums in a panel view*/
                      this.state.forumList.map((forum, index) => {
                          return(
                            <ForumComponent key={index} thread_id={forum.key} author_name={forum.author_name} subject={forum.subject} timestamp={forum.timestamp} message={forum.message} toggleCreateCommentModal={this.toggleCreateCommentModal}/>
                          )
                        })
                    }
               </div>
               { /*This will check if the state of the Create comment is true. If it is, it will call the CreateComment file which displays the Modal*/}
               {this.state.createComment && <CreateComment closeCreateCommentModal={this.toggleCreateCommentModal} thread_id={this.state.thread_id}/>}
            </div>
        )
    }
}

export default Forum;
