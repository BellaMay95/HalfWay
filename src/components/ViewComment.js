import React, {Component} from 'react';
import { app } from '../base';
import { Modal, Button, ListGroup, ListGroupItem, Image, Alert, Popover, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import './ViewComment.css';
import warning from '../images/warning.png';
import warningGrey from '../images/warning-grey.png';

// create class
class ViewComment extends Component{
  constructor(props){
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.pullNextComments = this.pullNextComments.bind(this);
    this.nextButtonOnClickHandler = this.nextButtonOnClickHandler.bind(this);
    this.prevButtonOnClickHandler = this.prevButtonOnClickHandler.bind(this);
    this.handleOpenFlagCommentModal = this.handleOpenFlagCommentModal.bind(this);

    this.state = {
      // Array of current comments being displayed and the prev comments
      currentComments: [],
      currentPage: 0,
      totalPage:0,
      // Next comment for next page
      nextKey: '',
      nextTimeStamp: 0,
      moreCommentsToPull: true,
      // Comments being displayed to screen
      commentToDisplay: [],
      // Previous Comments that will be displayed if the prevButton is clicked
      prevCommentsToDisplay: [],
      // Next Comments that will be displayed if the nextButton is clicked
      nextCommentsToDisplay: [],
      // If on the first page or last Page
      firstPage: true, //originally we'll be on the first page
      lastPage: false, //may or may not be on the last page
    }
  }

componentWillMount(){
  if(this.state.totalPage === 0){
    this.nextButtonOnClickHandler();
  }
}

  // This toggles the View Comment Modal. This will be called after exit button has been clicked
  // The users may also use the x at the top right of the Modal to close the modal
  // Calls the function toggleCreateCommentModal
  closeModal(){
    this.props.closeViewCommentModal();
  }

  // Set up the first comments to be displayed and the nextKey and Location states
  pullNextComments(){

    // Getting instance of the database based on whether this is the first page or not
    if(this.state.totalPage === 0){
      this.database = app.database().ref().child('forum').child(this.props.thread_id).child('comments').orderByChild('timestamp').limitToFirst(6);
    }else{
      this.database = app.database().ref().child('forum').child(this.props.thread_id).child('comments').orderByChild('timestamp').limitToFirst(6).startAt(this.state.nextTimeStamp,this.state.nextKey);
    }
    // Set prevComments to current state of the current comments
    let prevComments = this.state.currentComments;
    let count = 0;
    let prevSize = prevComments.length;
    // The comments that will be displayed to the screen
    let newComments = [];

    // Push this new comment data onto the prevComments array
    this.database.on('child_added', snap => {
      count++;

      // Adding to our Prev Comment array
      prevComments.push({
        id: snap.key,
        author_id: snap.val().author_id,
        author_name: snap.val().author_name,
        message: snap.val().message,
        timestamp: snap.val().timestamp,
        flagged: snap.val().flagged,
        attachmentRefs: snap.val().attachmentRefs,
        attachmentUrls: snap.val().attachmentUrls,
        attachmentTitles: snap.val().attachmentTitles
      })

      // Getting the comments that will be displayed to the screen
      if(count < 6){
        newComments.push({
          id: snap.key,
          author_id: snap.val().author_id,
          author_name: snap.val().username,
          message: snap.val().message,
          timestamp: snap.val().timestamp,
          flagged: snap.val().flagged,
          attachmentRefs: snap.val().attachmentRefs,
          attachmentUrls: snap.val().attachmentUrls,
          attachmentTitles: snap.val().attachmentTitles
        })
      }
    })

    this.database.on('child_changed', snap => {
      for (var i=0; i < newComments.length; i++){
        if(newComments[i].id === snap.key) {
          newComments[i] = {
            id: snap.key,
            author_id: snap.val().author_id,
            author_name: snap.val().username,
            message: snap.val().message,
            timestamp: snap.val().timestamp,
            flagged: snap.val().flagged,
            attachmentRefs: snap.val().attachmentRefs,
            attachmentUrls: snap.val().attachmentUrls,
            attachmentTitles: snap.val().attachmentTitles
          }
          break;
        }
      }
    })

    // Check to see if 6 were pulled to see if the next button should be activated or not
    if(count < 6){
      this.setState({
        moreCommentsToPull: false,
        lastPage: true
      })
    }
    else{
      this.setState({
        moreCommentsToPull: true,
        // set the state of the key and location of the first comment on the next page
        nextKey: prevComments[prevSize+count-1].key,
        nextTimeStamp: prevComments[prevSize+count-1].timestamp,
      })

      // Getting rid of the double comment on the end
      prevComments.pop();
    }

    // Set what page we are on
    if(this.state.totalPage === 0){
      // Set to first emptyMessage
      this.setState({
        currentPage: 1,
        totalPage: 1,
      })
    }else{
      // Increment the page
      this.setState({
        currentPage: this.state.currentPage+1,
        totalPage: this.state.totalPage+1,
      })
    }

    // Set the state of the comment arrays
    this.setState({
      currentComments: prevComments,
      commentToDisplay: newComments,
    })
  }

  // Function that is called when next button is pressed
  nextButtonOnClickHandler(){

    this.setState({
      firstPage: false,
      lastPage: false,
    })

    //check to see if we're on the first page
    if (this.state.currentPage === 0) {
      //disable previous button if we're on the first page
      this.setState({
        firstPage: true
      });
    }
    // Check if we are in the middle of the array
    if(this.state.currentPage !== this.state.totalPage){

      // If we are in the middle then move to the next location
      // Set up the previous comments to be displayed to the current comments being displayed
      // Set the current comments to be displayed to the nextCommentsToDisplay
      this.setState({
        currentPage: this.state.currentPage+1,
        prevCommentsToDisplay: this.state.commentToDisplay,
        commentToDisplay: this.state.nextCommentsToDisplay,
      })

      // *************************Set the nextCommentsToDisplay*******************************
      let tempNext = [];
      let location = ((this.state.currentPage * 5) + 5);
      let location1;

      // Check if there should be a next page
      if((this.state.currentPage+1) !== this.state.totalPage){
        // Check if the next page is the last page
        if((this.state.currentPage+2) !== this.state.totalPage){
            location1 = (location+5);
            this.setState({lastPage: true});
        }else{
          location1 = this.state.currentComments.length;
        }
      }

      // Getting the array of the next array
      tempNext = this.state.currentComments.slice(location, (location1));

      this.setState({
        nextCommentsToDisplay: tempNext,
      })

    } 
    else{ //otherwise we're on the last page
      // Sees if the next button should be activated
      if(this.state.moreCommentsToPull){ // true

        // Set up the previous comments to be displayed to the current comments being displayed
        this.setState({
          prevCommentsToDisplay: this.state.commentToDisplay,
          nextCommentsToDisplay: [],
        })

        // Pull call function to pull next set down from database
        this.pullNextComments();
      }
      else{
        // If not then it display no new comments message to the closeCreateCommentModal
        /*alert("You are on the last page."); */
        this.setState({
          lastPage: true,
        })
      }
    }
  }

  /*-------- This function handles loading the comments on the previous page and
              set the commentToDisplay to them ---------*/
  prevButtonOnClickHandler(){

    this.setState({
      firstPage: false,
      lastPage: false,
    })

    // Check if the their should be a prev page
    if(this.state.currentPage === 1){
        /*alert("You are on the first page*/
        this.setState({
          firstPage: true,
        })
    }else if(this.state.currentPage === 0){
        //alert("There are no comments to be displayed");
    }else{

      let location = (((this.state.currentPage-1)*5) - 10);
      let location1 = (location+5);

      let tempPrev = [];

      // Check if the there is a prev page to display
      if(this.state.currentPage !== 1){
        tempPrev = this.state.currentComments.slice(location, (location1));
      }

      //Whether we'll be on the first page after loading previous comments
      let disableFirstPage = (this.state.currentPage-1) > 1 ? false : true
      console.log(disableFirstPage);

      // Change the page and location in the array we are on
      // Set up the next comments to be displayed when the next button is clicked
      // Set the commentToDisplay (Current comment needing to be displayed) to the previous Comments
      this.setState({
        prevCommentsToDisplay: tempPrev,
        currentPage: this.state.currentPage-1,
        nextCommentsToDisplay: this.state.commentToDisplay,
        commentToDisplay: this.state.prevCommentsToDisplay,
        firstPage: disableFirstPage
      });
    }
}

// Calls the toggleFlagForumPost function in ForumList.js
handleOpenFlagCommentModal(commentID, CommentMessage, CommentAuthor){

  this.props.toggleFlagCommentPost(this.props.thread_id, this.props.thread_message, this.props.thread_UserName, commentID, CommentMessage, CommentAuthor);
}

  render(){
    const popoverRight = (
      <Popover id="popover-positioned-right">
        This comment has already been flagged.
      </Popover>
    );

    return(
      <div className="static-modal">
        <Modal.Dialog style={{overflow: 'auto'}}>
            <Modal.Header className="commentModalHeader">
              {console.log("ViewComment:: In the render")}
              <Modal.Title>View Comments</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {this.props.showAlert}
              <ListGroup componentClass="ul">
                <div>
                  {   //displays message if there aren't any Comments to display
                      this.state.commentToDisplay.length === 0 ?
                          <Alert bsStyle="warning" id="emptyComments">No comments yet! Be the first to start the conversation!</Alert>
                      : null
                  }
                  {
                    // display on last page alertState
                    /*this.state.firstPage === true ?
                          <Alert bsStyle="success">You are on the first page.</Alert>
                      : null*/
                  }
                  {
                    this.state.commentToDisplay.map((comment, index) => {
                      let commentId = "comment" + index;
                      let flagId = "flagComment" + index;
                      let attachments = [];
                      if (comment.attachmentRefs) {
                        for (let i=0; i < comment.attachmentRefs.length; i++) {
                          let key = "file_" + i;
                          attachments.push(
                            <Button bsStyle="link" href={comment.attachmentUrls[i]} target="_blank" key={key}>
                              {comment.attachmentTitles[i]}
                            </Button>)
                        }
                      }
                      return(
                        <div key={commentId + "-" + comment.timestamp}>
                          <ListGroupItem className="commentItem" key={index} id={commentId}>
                            <div>
                              <p>{comment.message}</p>
                              <p className="cite"><cite>{comment.author_name}</cite></p>
                              
                              <div className="keywordbullshit">
                                {/*<a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>*/
                                  comment.flagged ? <OverlayTrigger trigger="click" placement="right" overlay={popoverRight}><Image className="warningSign" src={warningGrey} responsive /></OverlayTrigger>
                                : <Image className="warningSign" src={warning} id={flagId} responsive onClick={() => this.handleOpenFlagCommentModal(comment.id, comment.message, comment.author_name)}/>
                                }
                              </div>
                              {attachments ? 
                                <div>
                                  <Glyphicon glyph="paperclip"></Glyphicon>
                                  {attachments}
                                </div>
                                : null
                              }
                              <div className="clearfix"></div>
                            </div>
                          </ListGroupItem>
                      </div>
                    )
                  })
                }
                {
                  // display on last page alertState
                  /*this.state.lastPage === true ?
                        <Alert bsStyle="success">You are on the last page.</Alert>
                    : null*/
                }
                </div>
              </ListGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button id="closeModal" onClick={this.closeModal}>Close</Button>
                { this.state.commentToDisplay.length > 0 ? <Button id="prevComments" bsStyle="primary" disabled={this.state.firstPage} onClick={this.prevButtonOnClickHandler}>Previous Page</Button> : null }
                { this.state.commentToDisplay.length > 0 ? <Button id="nextComments" bsStyle="primary" disabled={this.state.lastPage} onClick={this.nextButtonOnClickHandler}>Next Page</Button> : null }
                </Modal.Footer>
        </Modal.Dialog>
      </div>
    )}
}

export default ViewComment;
