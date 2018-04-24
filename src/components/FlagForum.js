import React, {Component} from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import { app } from '../base';
import './FlagForum.css'

class FlagForum extends Component {

  constructor(props){
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.flagForumPost = this.flagForumPost.bind(this);

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
    this.props.closeViewFlagForum();
  }

  flagForumPost(){
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
      reason_message: this.state.reasonMessage,
    }

    app.database().ref('flaggedForum/').push(flagInfo, (err) => {
      if (!err) {
        this.setState({
          isLoading: false 
        });
        this.props.showAlert("Flagged Forum Post!", "success");
        this.closeModal();

      } else {
        //alert("Error flagging post!");
        //this.closeModal();
        this.setState({
          alertState: <Alert bsStyle="danger">Error Flagging Post!</Alert>,
          isLoading: false
        });

        window.setTimeout(() => {
            this.setState({ alertState: null });
        }, 5000);
      }
    });
  }


  render(){
    return (
        <div className="static-modal">
          <Modal.Dialog style={{overflow: 'auto'}}>
              <Modal.Header>
                <Modal.Title>Report this forum post.</Modal.Title>
              </Modal.Header>
              {this.state.alertState}

              <Modal.Body>
                <div className='modalBody'>
                  <h4 className='modalBodyHeader'>Thank you for reporting this post.</h4>

                  <p className='modalBodyParagraph' align="left">Please fill out the reason you are reporting this post. Some of the reasons for reporting this post may include:</p>
                  <ul className='modalBodyList' align="left">
                    <li>Inappropriate language</li>
                    <li>Advertising spam</li>
                    <li>Unfit/Bullying content</li>
                  </ul>
                  <div>
                    <form>
                      {/* Text Box that the user enters their comments in */}
                      <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>Add your reason for flagging this forum post:</ControlLabel>
                        <FormControl componentClass="textarea" placeholder="Reason" onChange={(evt) => {this.setState({reasonMessage: evt.target.value})}}/>
                      </FormGroup>
                    </form>
                  </div>
              </div>
              <div className="clearfix"></div>
              </Modal.Body>

              <Modal.Footer>
                  <Button id="closeModal" onClick={this.closeModal}>Close</Button>
                  <Button id="flagPostNow" bsStyle="primary" onClick={this.flagForumPost}>Submit</Button>
              </Modal.Footer>
          </Modal.Dialog>
      </div>
    );
  }
}

export default FlagForum;
