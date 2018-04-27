import React, {Component} from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Alert } from 'react-bootstrap';
import { app } from '../base';

// FieldGroup set-up pull directly from react boostrap
/*function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}*/

class CreateComment extends Component{
  constructor(props){
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.saveComment = this.saveComment.bind(this);

    this.state = {
      comment: "",
      thread_id: this.props.thread_id,
      alertState: null
    }
  }

  // This toggles the Comment Modal. This will be called after a comment has been submitted
  // The users may also use the x at the top right of the Modal to close the modal
  // Calls the function toggleCreateCommentModal
  closeModal(){
    this.props.closeCreateCommentModal();
  }

  saveComment(){
    let message = this.state.comment;
    let username = app.auth().currentUser.displayName;
    let userId = app.auth().currentUser.uid
    let timestamp = new Date().getTime();

    let postInfo = {
      "message": message,
      "username": username,
      "userId": userId,
      "timestamp": timestamp,
      "flagged": false
    }

    // Pushing to the database
    app.database().ref('forum/' + this.state.thread_id + '/comments').push(postInfo, (err) => {
      if (!err) {
        this.props.showAlert("Comment Posted Successfully!", "success");
        this.closeModal();
      } else {
        //alert("Error posting comment!");
        //this.closeModal();
        this.setState({ alertState: <Alert bsStyle="danger">Error Posting Comment!</Alert>});

        window.setTimeout(() => {
            this.setState({ alertState: null });
        }, 5000); 
      }
    });

    // After saving call closeModal to toggle the Modal
    //this.closeModal();
  }

  render(){
    return (
        <div className="static-modal">
          <Modal.Dialog style={{overflow: 'auto'}}>
              <Modal.Header>
                <Modal.Title>Create Comment</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {this.state.alertState}
                <form>
                  {/* Text Box that the user enters their comments in */}
                  <FormGroup controlId="formControlsTextarea">
                    <ControlLabel>Add your comment:</ControlLabel>
                    <FormControl componentClass="textarea" placeholder="Comment" onChange={(evt) => {this.setState({comment: evt.target.value})}}/>
                  </FormGroup>

                  {/* Need to figure out how to allow them to add a photo and where this photo's contents is stored */}
                  {/*<FieldGroup
                        id="formControlsFile"
                        type="file"
                        label="Add Picture: "
                        help="Add a picture a picture to your comment."
                  />*/}
                  </form>
              </Modal.Body>

              <Modal.Footer>
                  <Button id="closeModal" onClick={this.closeModal}>Close</Button>
                  <Button id="createComment" bsStyle="primary" onClick={this.saveComment}>Create Comment!</Button>
              </Modal.Footer>
          </Modal.Dialog>
      </div>
    );
  }
}

export default CreateComment;
