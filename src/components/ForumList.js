import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Glyphicon, Panel, PanelGroup } from 'react-bootstrap';
import { app } from '../base';

import CreateThread from './CreateThread';

class Forum extends Component {
    constructor(props) {
        super(props);
        this.getThreads = this.getThreads.bind(this);
        this.toggleThreadModal = this.toggleThreadModal.bind(this);
        this.state = {
            createThread: false
        }
    }

    toggleThreadModal() {
        this.setState({createThread: !this.state.createThread});
    }

    getThreads() {
        var threads = app.database().ref('forum');
        let childData = {
            author_name: "Jane",
            timestamp: "2018-02-24",
            message: "Hey! Just wanted to say I'm glad to be here and I hope this turns out to be a good message board!",
            subject: "Hello Everyone!"
        }

        //let stuff = 
        // threads.on('value', function(snapshot) {
            //snapshot.forEach((childSnapshot) => {
                //var childKey = childSnapshot.key;
                //var childData = childSnapshot.val();

                //stuff += (<Panel>
                  //  <Panel.Heading>
                    //    <Panel.Title componentClass='h3'>{childData.author_name} : {childData.subject} : {childData.timestamp} </Panel.Title>
                  //  </Panel.Heading>
                //    <Panel.Body>{childData.message}</Panel.Body>
              //  </Panel>);
            //});
            //stuff += "</PanelGroup>";
          //  return stuff;
        //});
        let stuff = (<PanelGroup id="forumThreads"><Panel>
            <Panel.Heading>
                <Panel.Title componentClass='h3'>{childData.author_name} : {childData.subject} : {childData.timestamp} </Panel.Title>
            </Panel.Heading>
            <Panel.Body>{childData.message}</Panel.Body>
        </Panel></PanelGroup>);

        //stuff += "</PanelGroup>;
        return stuff;
    }

    render() {
        let headerStyle = {
            fontFamily: "'Courier New', 'Courier', 'monospace'", 
            fontSize: 36, 
            fontWeight: "bold"
        }

        let threadList = this.getThreads();
        //console.log(threadList);

        return (
            <div className="container">
                <Navbar collapseOnSelect style={{marginTop: '5px'}}>
                    <Navbar.Header>
                        <Navbar.Brand style={headerStyle}>Forums</Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem eventKey={1} onClick={this.toggleThreadModal}>
                                Create New Thread 
                                <Glyphicon glyph="plus-sign" style={{padding: '5px'}}/>
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                {this.state.createThread && <CreateThread closeThreadModal={this.toggleThreadModal}/>}

                {threadList}
            </div>
        )
    }
}

export default Forum;