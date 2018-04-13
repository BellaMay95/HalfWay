import React, { Component } from 'react';
import {Button, Panel} from 'react-bootstrap';
import { app } from '../base';
import FlagsComponent from './FlagsComponent';
import FlagsCommentComponent from './FlagsCommentComponent'

var length = 0;
export default class ViewFlags extends Component {
  constructor(props) {
    super(props);
    this.database = app.database().ref().child('flaggedForum');
    this.databaseC = app.database().ref().child('flaggedComments');

    this.state = {
      flagsArr: [],
      flaggedCommentsArr: [],
    }
  }

  componentWillMount(length){

    //section  begins for setting up flagged posts
    var flaggedPosts = this.state.flagsArr;
      // Set previousForum to current state

    // Get DataSnapshot every time a child is added to the array
    this.database.on('child_added', snap => {
      flaggedPosts.push({
        id: snap.key,
        thread_id: snap.val().thread_id,
        //author_name: snap.val().author_name,
        reason_message: snap.val().reason_message,
        thread_message: snap.val().thread_message,
        thread_userName: snap.val().thread_userName,
      })

      //reverse the array to show newest posts first
      //prevJob = prevJob.reverse();
      // Push the array that we have just updated (previousForum) to the state
      this.setState({
        flagsArr: flaggedPosts,
      })
    })

//section begings for setting up getting comment flags
      var flaggedComments = this.state.flaggedCommentsArr;
        // Set previousForum to current state

      // Get DataSnapshot every time a child is added to the array
      this.databaseC.on('child_added', snap => {
        flaggedComments.push({
          id: snap.key,
          thread_id: snap.val().thread_id,
          reason_message: snap.val().reason_message,
          thread_message: snap.val().thread_message,
          thread_userName: snap.val().thread_userName,
          comment_message: snap.val().comment_message,
          comment_id: snap.val().comment_id,
        })
        length = length+1;
        //reverse the array to show newest posts first
        //prevJob = prevJob.reverse();
        // Push the array that we have just updated (previousForum) to the state
        this.setState({
          flaggedCommentsArr: flaggedComments,
        })
      })


  }



    render(){
      if (this.state.flagsArr.length === 0 && this.state.flaggedCommentsArr.length === 0)
      {
        return(<h1>Currently NO Flagged Posts or Comments</h1>);

      }
      return(
        <div>
        <Panel>

        {/*.map function runs through all flagged posts and sends them to the flag component*/}
        <Panel.Body>

        {



        this.state.flagsArr.map((post , index) => {
            if (index === 0){
              return(<div><h1>Flagged Posts</h1><FlagsComponent flagged_id = {post.id}  thread_id={post.thread_id} reason_message={post.reason_message} thread_message={post.thread_message} thread_userName={post.thread_userName}/></div>);
            }
            return(
              <FlagsComponent flagged_id = {post.id}  thread_id={post.thread_id} reason_message={post.reason_message} thread_message={post.thread_message} thread_userName={post.thread_userName}/>
            )
        })


        }
        </Panel.Body>
        </Panel>
        {/*.map function runs through all flagged comments and sends them to the flag component*/}

        <Panel>
        <Panel.Body>
        {
        this.state.flaggedCommentsArr.map((com , index) => {
            if (index === 0){
              return(<div><h1>Flagged Comments</h1><FlagsCommentComponent flagged_id = {com.id}  thread_id={com.thread_id} reason_message={com.reason_message} thread_message={com.thread_message} thread_userName={com.thread_userName} comment_id={com.comment_id} comment_message={com.comment_message}/></div>);
            }
            return(
              <FlagsCommentComponent flagged_id = {com.id}  thread_id={com.thread_id} reason_message={com.reason_message} thread_message={com.thread_message} thread_userName={com.thread_userName} comment_id={com.comment_id} comment_message={com.comment_message}/>
            )
        })
        }
        </Panel.Body>
        </Panel>
        </div>

      );

    }
}
