import React, {Component} from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import { app } from '../base';
import './FlagComment.css';

class FlagComment extends Component {

  constructor(props){
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.flagCommentPost = this.flagCommentPost.bind(this);

    this.state = {
      alertState: null,
      isLoading: false,
      reasonMessage: "",
      thread_id: this.props.thread_id,
      createAlert: null,
      submitted: false,
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
      thread_id: this.state.thread_id,
      thread_message: this.props.thread_message,
      thread_userName: this.props.thread_UserName,
      comment_id: this.props.comment_id,
      comment_message: this.props.comment_message,
//      comment_UserName: this.props.comment_UserName,
      reason_message: this.state.reasonMessage,
    }

    app.database().ref('flaggedComments/').push(flagInfo, (err) => {
      if (!err) {
        app.database().ref('forum/' + flagInfo.thread_id + "/comments/" + flagInfo.comment_id).update({
          flagged: true
        })
        .then(() => {
          this.setState({ isLoading: false });

          this.setState({
            submitted: true,
          })
        })
        .catch((err) => {
          this.setState({
            alertState: <Alert bsStyle="danger">Error Flagging Comment! Try again later.</Alert>,
            isLoading: false
          });
  
          window.setTimeout(() => {
              this.setState({ alertState: null });
          }, 5000);
        });

        //this.closeModal();
      } else {
        //alert("Error posting thread!");
        this.setState({
          alertState: <Alert bsStyle="danger">Error Flagging Comment! Try again later.</Alert>,
          isLoading: false
        });

        window.setTimeout(() => {
            this.setState({ alertState: null });
        }, 5000);

        //this.closeModal();
      }
    });
  }

  render(){
    return (
        <div className="static-modal">
          <Modal.Dialog style={{overflow: 'auto'}}>
              <Modal.Header>
                <Modal.Title>Report this comment.</Modal.Title>
              </Modal.Header>

              {this.state.alertState}

              <Modal.Body>
                <div className='modalBody'>
                  <div>
                  {
                    this.state.submitted === true ?
                    <div>
                      <Alert bsStyle="success" className="alertFlagComment">{"Comment Flagged Successfully!"}</Alert>
                    </div>
                    :
                    <div>
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
                  }
                  </div>
                </div>
                <div className="clearfix"></div>

              </Modal.Body>

              <Modal.Footer>
                  {
                    this.state.submitted === true ?
                    <div>
                      <Button id="closeModal" onClick={this.closeModal}>Close</Button>
                    </div>
                    :
                    <div>
                      <Button id="closeModal" onClick={this.closeModal}>Close</Button>
                      <Button id="flagCommentNow" bsStyle="primary" onClick={this.flagCommentPost}>Submit</Button>
                    </div>
                  }
              </Modal.Footer>
          </Modal.Dialog>
      </div>
    );
  }
}

export default FlagComment;
