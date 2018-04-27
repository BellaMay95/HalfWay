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

class CreateResource extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.closeModal = this.closeModal.bind(this);
        this.saveNewResource = this.saveNewResource.bind(this);
        this.state = {
          title: "",
          message: "",
          alertState: null
        }
    }

    closeModal() {

        this.props.closeThreadModal();

    }

    saveNewResource(myProp) {

      if(this.state.title === "" || this.state.message === "") {
        alert("One or more required fields are blank.")
          return;
      }

        //alert("title: " + this.state.title + " and message: " + this.state.message);
        let title = this.state.title;
        let resContent = this.state.message;
        let username = app.auth().currentUser.displayName;
        let userId = app.auth().currentUser.uid;
        let timestamp = new Date().toString();

        //alert(newpostref);
        let postInfo = {
          "author_id": userId,
          "author_name": username,
          "message": resContent,
          "subject": title,
          "timestamp": timestamp
        };
        app.database().ref('resources/' + this.props.myProp).push(postInfo, (err) => {
          if (!err) {
            //alert("Resource Posted Successfully!");
            this.props.showAlert("Resource Posted Successfully!", "success");
            this.closeModal();
          } else {
            //alert("Error posting Resource!");
            //this.closeModal();
            this.setState({ alertState: <Alert bsStyle="danger">Error posting Resource!</Alert>});
    
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
            <Modal.Dialog style={{overflow: 'auto'}}>
                <Modal.Header>
                <Modal.Title>Create New Resource!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  {this.state.alertState}
                  <form>
                    <FieldGroup
                      id="formControlsSubject"
                      type="text"
                      label="Resource"
                      placeholder="Enter Resource Title!"
                      onChange={(evt) => {this.setState({title: evt.target.value})}}
                    />
                    <FormGroup controlId="formControlsMessage">
                      <ControlLabel>Resource Info</ControlLabel>
                      <FormControl componentClass="textarea" placeholder="Enter Resource Info!" onChange={(evt) => {this.setState({message: evt.target.value})}} />
                    </FormGroup>
                  </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.closeModal}>Close</Button>
                    <Button bsStyle="primary" onClick={this.saveNewResource}>Create Resource!</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>);
    }
}

export default CreateResource;
