import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Glyphicon, Well, Alert } from 'react-bootstrap';
import { app } from '../base';
import ForumComponent from './ForumComponent';
import CreateThread from './CreateThread';
import CreateComment from './CreateComment';
import ViewComment from './ViewComment';
import FlagForum from './FlagForum';
import FlagComment from './FlagComment';
import './ForumList.css';

class Forum extends Component {
    constructor(props) {
        super(props);
        this.toggleThreadModal = this.toggleThreadModal.bind(this);
        this.createThreadAlert = this.createThreadAlert.bind(this);
        this.toggleCreateCommentModal = this.toggleCreateCommentModal.bind(this);
        this.toggleViewCommentModal = this.toggleViewCommentModal.bind(this);
        this.toggleFlagForumPost = this.toggleFlagForumPost.bind(this);
        this.toggleFlagCommentPost = this.toggleFlagCommentPost.bind(this);

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
            viewFlagForum: false,
            viewFlagComment: false,
            // Array that holds all of the Forums pulled from the database
            forumList: [],
            thread_id: null,
            thread_message: null,
            thread_UserName: null,
            comment_id: null,
            comment_message: null,
            comment_UserName: null,
        }
    }

    // Will mount happens after initialization but before the render (for more information look up the lifecycles of react components)
    // This will be where the forumList array is filled in by pulling from the database
    componentWillMount(){
      let prevForum = this.state.forumList;  // Set previousForum to current state

      // Get DataSnapshot every time a child is added to the array
      // Push this new forum data onto the prevForum array
      this.database.on('child_added', snap => {
        prevForum.unshift({
          id: snap.key,
          author_id: snap.val().author_id,
          author_name: snap.val().author_name,
          message: snap.val().message,
          subject: snap.val().subject,
          timestamp: this.getDateTime(snap.val().timestamp),
          alertState: null,
          isLoading: false,
        })

        // Push the array that we have just updated (previousForum) to the state
        //  Set forumList to the prevForum
        this.setState({
          forumList: prevForum,
        })
      })

      this.database.on('child_removed', snap => {     // Listening for when a child gets removed from our database
        for(var i=0; i < prevForum.length; i++){ // Get all items in array
          if(prevForum[i].id === snap.key){
            prevForum.splice(i,1); // Splice out of notes array // Par (i: at this index, 1: how many to delete)
          }
        }
        // Push the array that we have just updated (previousNotes) to the state
        this.setState({
          notes: prevForum
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
    toggleViewCommentModal(threadID, threadMessage, threadUserName){
      this.setState({
        viewComment: !this.state.viewComment,
        thread_id: threadID,
        thread_message: threadMessage,
        thread_UserName: threadUserName,
      });
    }

    toggleFlagForumPost(threadId, threadMessage, threadUserName){
      this.setState({
        viewFlagForum: !this.state.viewFlagForum,
        thread_id: threadId,
        thread_message: threadMessage,
        thread_UserName: threadUserName,
      })
    }

    toggleFlagCommentPost(threadId, threadMessage, threadUserName, commentId, commentMessage, commentUserName){
        this.setState({
        viewFlagComment: !this.state.viewFlagComment,
        thread_id: threadId,
        thread_message: threadMessage,
        thread_UserName: threadUserName,
        comment_id: commentId,
        comment_message: commentMessage,
        comment_UserName: commentUserName,
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
                <Navbar className="navbarForum"  collapseOnSelect style={{marginTop: '5px'}}>
                  <div>
                    <Navbar.Header>
                        <span><h3 className="brandForum">Forums</h3></span>
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
                  </div>
                </Navbar>
                {this.state.createThread && <CreateThread showAlert={this.createThreadAlert} closeThreadModal={this.toggleThreadModal}/>}
                {this.state.createAlert}
                <div className='forumBody'>
                    {   //displays message if there aren't any forum threads to display
                        this.state.forumList.length === 0 ?
                            <Well id="emptyMessage">No threads yet! Be the first to start the conversation!</Well>
                        : /* Going through the array and displaying all of the forums in a panel view*/
                        this.state.forumList.map((forum, index) => {
                            let forum_id = "thread_" + index;
                            return(
                                <div key={forum.id} id={forum_id}>
                                <ForumComponent thread_id={forum.id} array_id={index} author_name={forum.author_name} subject={forum.subject} timestamp={forum.timestamp} message={forum.message} toggleCreateCommentModal={this.toggleCreateCommentModal} toggleViewCommentModal={this.toggleViewCommentModal} toggleFlagForumPost={this.toggleFlagForumPost} />
                                </div>
                            )
                        })
                    }
               </div>
               { /*This will check if the state of the Create comment is true. If it is, it will call the CreateComment file which displays the Modal*/}
               {this.state.createComment && <CreateComment closeCreateCommentModal={this.toggleCreateCommentModal} thread_id={this.state.thread_id}/>}

               { /*This will check if the state of the View comment is true. If it is, it will call the ViewComment file which displays the Modal*/}
               {this.state.viewComment && <ViewComment closeViewCommentModal={this.toggleViewCommentModal} thread_id={this.state.thread_id} thread_message={this.state.thread_message} thread_UserName={this.state.thread_UserName} comment_id={this.state.comment_id} comment_message={this.state.comment_message} comment_UserName={this.state.comment_UserName} toggleFlagCommentPost={this.toggleFlagCommentPost}/>}

               {/*This will check if the state of the View comment is true. If it is, it will call the ViewComment file which displays the Modal*/}
               {this.state.viewFlagForum && <FlagForum closeViewFlagForum={this.toggleFlagForumPost} thread_id={this.state.thread_id} thread_message={this.state.thread_message} thread_UserName={this.state.thread_UserName}/>}

               {/*This will check if the state of the View comment is true. If it is, it will call the ViewComment file which displays the Modal*/}
               {this.state.viewFlagComment && <FlagComment closeViewFlagComment={this.toggleFlagCommentPost} thread_id={this.state.thread_id} thread_message={this.state.thread_message} thread_UserName={this.state.thread_UserName} comment_id={this.state.comment_id} comment_message={this.state.comment_message} comment_UserName={this.state.comment_UserName}/>}

            </div>
        )
    }
}

export default Forum;
