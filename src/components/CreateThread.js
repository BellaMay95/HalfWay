import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { app } from '../base';

class CreateThread extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.saveNewThread = this.saveNewThread.bind(this);
    }

    closeModal() {
        this.props.closeThreadModal();
    }

    saveNewThread() {
        alert("We'll save thread info later!")
        this.closeModal();
    }

    render() {
        return (<div className="static-modal">
            <Modal.Dialog>
                <Modal.Header>
                <Modal.Title>Create New Thread!</Modal.Title>
                </Modal.Header>

                <Modal.Body>Thread creation coming soon...</Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.closeModal}>Close</Button>
                    <Button bsStyle="primary" onClick={this.saveNewThread}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>);
    }
}

export default CreateThread;