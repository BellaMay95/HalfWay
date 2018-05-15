import React, {Component} from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Alert, Glyphicon} from 'react-bootstrap';
import { app } from '../base';

import FileUploader from 'react-firebase-file-uploader';

class CreateComment extends Component{
  constructor(props){
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);

    this.state = {
      comment: "",
      thread_id: this.props.thread_id,
      alertState: null,
      isUploading: false,
      progress: 0,
      attachmentRefs: [],
      attachmentUrls: [],
      attachmentTitles: [],
      attachmentList: []
    }
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
    app.storage().ref('commentAttachments').child(filename).getDownloadURL()
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
    app.storage().ref('commentAttachments/' + fileRef).delete()
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
      "flagged": false,
      "attachmentRefs": this.state.attachmentRefs,
      "attachmentUrls": this.state.attachmentUrls,
      "attachmentTitles": this.state.attachmentTitles
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
                  <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor'}}>
                      Select Attachments
                      <FileUploader
                        storageRef={app.storage().ref('commentAttachments')}
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
                  <Button id="closeModal" onClick={this.closeModal}>Close</Button>
                  <Button id="createComment" bsStyle="primary" onClick={this.saveComment}>Create Comment!</Button>
              </Modal.Footer>
          </Modal.Dialog>
      </div>
    );
  }
}

export default CreateComment;
