import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Alert } from 'react-bootstrap';
import { app } from '../base';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class CreateThread extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.saveNewThread = this.saveNewThread.bind(this);
        this.state = {
          title: "",
          message: "",
          alertState: null,
        }
    }

    closeModal() {
        this.props.closeThreadModal();
    }

    saveNewThread() {
        //alert("title: " + this.state.title + " and message: " + this.state.message);
        if(this.state.title === "" || this.state.message === "") {
          this.setState({ alertState: <Alert bsStyle="warning">One or more required fields are empty.</Alert>});

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
            return;
        }

        let title = this.state.title;
        let message = this.state.message;
        let username = app.auth().currentUser.displayName;
        let userId = app.auth().currentUser.uid;
        let timestamp = new Date().getTime();
       
        //alert(newpostref);
        let postInfo = {
          "author_id": userId,
          "author_name": username,
          "message": message,
          "subject": title,
          "timestamp": timestamp
        };
        app.database().ref('forum').push(postInfo, (err) => {
          if (!err) {
            //alert("Thread Posted Successfully!");
            this.props.showAlert();
            this.closeModal();
          } else {
            //alert("Error posting thread!");
            //this.closeModal();
            this.setState({ alertState: <Alert bsStyle="danger">Error Creating Thread! Try again later.</Alert>});

            window.setTimeout(() => {
                this.setState({ alertState: null });
            }, 5000);
          }
        });
        //alert(JSON.stringify(postInfo));
        //newpostref.set(postInfo);   
    }

    render() {
        return (<div className="static-modal">
            <Modal.Dialog>
                {this.state.alertState}
                <Modal.Header>
                <Modal.Title>Create New Thread!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <form>
                    <FieldGroup
                      id="formControlsSubject"
                      type="text"
                      label="Subject"
                      placeholder="Enter Thread Title!"
                      onChange={(evt) => {this.setState({title: evt.target.value})}}
                    />
                    <FormGroup controlId="formControlsMessage">
                      <ControlLabel>Message</ControlLabel>
                      <FormControl componentClass="textarea" placeholder="Enter Message!" onChange={(evt) => {this.setState({message: evt.target.value})}} />
                    </FormGroup>
                  </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.closeModal}>Close</Button>
                    <Button bsStyle="primary" onClick={this.saveNewThread}>Create Thread!</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>);
    }
}

export default CreateThread;