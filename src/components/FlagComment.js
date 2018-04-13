import React, {Component} from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Alert } from 'react-bootstrap';
import { app } from '../base';

// FieldGroup set-up pull directly from react boostrap
function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class FlagComment extends Component {

  constructor(props){
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.flagCommentPost = this.flagCommentPost.bind(this);

    this.state = {
      alertState: null,
      isLoading: false,
      reasonMessage: "",
    }
  }

  // This toggles the Comment Modal. This will be called after a comment has been submitted
  // The users may also use the x at the top right of the Modal to close the modal
  // Calls the function toggleCreateCommentModal
  closeModal(){
    this.props.closeViewFlagComment();
  }

  flagCommentPost(){
    // Checking to see if any fields are left _blank
    this.setState({ isLoading: true });
    if(this.state.reasonMessage === "") {
      this.setState({
        alertState: <Alert bsStyle="warning">One or more required fields are empty.</Alert>,
        isLoading: false
      });

        window.setTimeout(() => {
            this.setState({ alertState: null });
        }, 5000);
        return;
    }

    // Push to the flagged post to the database
    let flagInfo = {
      thread_id: this.props.thread_id,
      thread_message: this.props.thread_message,
      thread_userName: this.props.thread_UserName,
      comment_id: this.props.comment_id,
      comment_message: this.props.comment_message,
//      comment_UserName: this.props.comment_UserName,
      reason_message: this.state.reasonMessage,
    }

    app.database().ref('flaggedComments/').push(flagInfo, (err) => {
      if (!err) {
        this.setState({ isLoading: false });
        this.closeModal();
      } else {
        alert("Error posting thread!");
        this.closeModal();
        this.setState({
          alertState: <Alert bsStyle="danger">Error Flagging Comment! Try again later.</Alert>,
          isLoading: false
        });

        window.setTimeout(() => {
            this.setState({ alertState: null });
        }, 5000);
      }
    });

    this.closeModal;
  }


  render(){
    return (
        <div className="static-modal">
          <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Report this comment.</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div className='modalBody'>
                  <h4 className='modalBodyHeader'>Thank you for reporting this comment.</h4>

                  <p className='modalBodyParagraph' align="left">Please fill out the reason you are reporting this comment. Some of the reasons for reporting this comment may include:</p>
                  <ul className='modalBodyList' align="left">
                    <li>Inappropriate language</li>
                    <li>Advertising spam</li>
                    <li>Unfit/Bullying content</li>
                  </ul>
                  <div>
                    <form>
                      {/* Text Box that the user enters their comments in */}
                      <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>Add your reason for flagging this comment:</ControlLabel>
                        <FormControl componentClass="textarea" placeholder="Reason" onChange={(evt) => {this.setState({reasonMessage: evt.target.value})}}/>
                      </FormGroup>
                    </form>
                  </div>
              </div>
              <div className="clearfix"></div>
              </Modal.Body>

              <Modal.Footer>
                  <Button onClick={this.closeModal}>Close</Button>
                  <Button bsStyle="primary" onClick={this.flagCommentPost}>Submit</Button>
              </Modal.Footer>
          </Modal.Dialog>
      </div>
    );
  }
}

export default FlagComment;
