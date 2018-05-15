import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Glyphicon } from 'react-bootstrap';
import { app } from '../base';

import FileUploader from 'react-firebase-file-uploader';

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

class CreateThread extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.saveNewThread = this.saveNewThread.bind(this);
        this.handleProgress = this.handleProgress.bind(this);
        this.handleUploadError = this.handleUploadError.bind(this);
        this.handleUploadStart = this.handleUploadStart.bind(this);
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);

        this.state = {
          title: "",
          message: "",
          alertState: null,
          isLoading: false,
          isUploading: false,
          progress: 0,
          attachmentRefs: [],
          attachmentUrls: [],
          attachmentTitles: [],
          attachmentList: []
        }
    }

    // Changes state of the createThread in ForumList thus closing the modal
    closeModal() {
        this.props.closeThreadModal();
    }

    handleUploadStart = () => this.setState({isUploading: true, progress: 0});
    handleProgress = (progress) => this.setState({progress});
    handleUploadError = (error) => {
      this.setState({isUploading: false});
      console.error(error);
    }
    handleUploadSuccess = (filename, task) => {
      //original filename
      let name = task.blob_.data_.name
      app.storage().ref('forumAttachments').child(filename).getDownloadURL()
      .then((url) => {
        let refs = this.state.attachmentRefs;
        let urls = this.state.attachmentUrls;
        let titles = this.state.attachmentTitles;
        let list = this.state.attachmentList ? this.state.attachmentList : [];
        refs.push(filename);
        urls.push(url);
        titles.push(name);
        list.push(
          <div key={filename}>
            <Button bsStyle="link" href={url}>{name}</Button>
            <Glyphicon glyph="remove" onClick={() => {this.removeFile(filename)}}></Glyphicon>
          </div>
        )
        this.setState({
          progress: 100,
          isUploading: false,
          attachmentRefs: refs,
          attachmentUrls: urls,
          attachmentTitles: titles,
          attachmentList: list
        })
      });
    };

    removeFile(fileRef) {
      app.storage().ref('forumAttachments/' + fileRef).delete()
      .then(() => {
        //remove file from visible list
        console.log("removed file!");
        let list = this.state.attachmentList;
        console.log("checking for record")
        for (let i=0; i < list.length; i++) {
          console.log(list[i]);
          if (list[i].key === fileRef) {
            console.log('found record!');
            list.splice(i,1);
            break;
          }
        }

        //remove file from list to save
        let titles = this.state.attachmentTitles;
        let refs = this.state.attachmentRefs;
        let urls = this.state.attachmentUrls;
        for (let i=0; i < this.state.attachmentRefs.length; i++) {
          if (refs[i] === fileRef) {
            titles.splice(i,1);
            refs.splice(i,1);
            urls.splice(i,1);
            break;
          }
        }
        this.setState({
          attachmentList: list,
          attachmentRefs: refs,
          attachmentTitles: titles,
          attachmentUrls: urls
        })
      })
      .catch((err) => {
        console.log("error removing file!");
        console.log(err);
      })
    }

    // Pushing the new thread to the data
    saveNewThread() {
        this.setState({ isLoading: true });
        //alert("title: " + this.state.title + " and message: " + this.state.message);
        if(this.state.title === "" || this.state.message === "") {
          this.setState({
            alertState: <Alert bsStyle="warning">One or more required fields are empty.</Alert>,
            isLoading: false
          });

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
          "timestamp": timestamp,
          "flagged": false,
          "attachmentRefs": this.state.attachmentRefs,
          "attachmentUrls": this.state.attachmentUrls,
          "attachmentTitles": this.state.attachmentTitles
        };
        app.database().ref('forum').push(postInfo, (err) => {
          if (!err) {
            //alert("Thread Posted Successfully!");
            this.setState({ isLoading: false });
            this.props.showAlert("Thread Posted Successfully!", "success");
            this.closeModal();
          } else {
            //alert("Error posting thread!");
            //this.closeModal();
            this.setState({
              alertState: <Alert bsStyle="danger">Error Creating Thread! Try again later.</Alert>,
              isLoading: false
            });

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
            <Modal.Dialog style={{ overflow: 'auto' }}>
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
                    {this.state.isUploading &&
                      <p>Progress: {this.state.progress}</p>
                    }
                    <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor'}}>
                      Select Attachments
                      <FileUploader
                        storageRef={app.storage().ref('forumAttachments')}
                        onUploadStart={this.handleUploadStart}
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        onProgress={this.handleProgress}
                        multiple
                        randomizeFilename
                        hidden
                      />
                    </label>
                    {
                      <div>
                        {this.state.attachmentList}
                      </div>
                    }
                  </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.closeModal}>Close</Button>
                    <Button bsStyle="primary" onClick={this.saveNewThread} disabled={this.state.isLoading}>Create Thread!</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>);
    }
}

export default CreateThread;
