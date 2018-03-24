import React, { Component } from 'react';
import { Navbar, Panel, PanelGroup } from 'react-bootstrap';
import { app } from '../base';
import CreateResource from './CreateResource';


export default class Resources extends Component{


  constructor(props) {
    super(props);
    //let resType = '';
    this.handleSelect = this.handleSelect.bind(this);
    this.checkAdmin = this.checkAdmin.bind(this);
    this.toggleResourceModal = this.toggleResourceModal.bind(this);
    this.state = {
      activeKey: 'null',
      createResource: false,
      resType: ''
    }
  }

  handleSelect(activeKey) {
    console.log(activeKey);
    let resType;
    if (activeKey == 1)
    {
      this.setState({ resType: 'job' });
      resType = 'job';
      //console.log(resType);
    }
    if (activeKey == 2)
    {
      this.setState({ resType: 'affordablehousing' });
      resType = 'affordablehousing';
      console.log(resType);
    }
    this.setState({ activeKey: activeKey });

  }

  toggleResourceModal(activeKey) {
      this.setState({createResource: !this.state.createResource});
      //console.log(activeKey);

  }

  componentWillMount() {
	//checks for admin privileges before rendering component
		this.checkAdmin()
		.then((result) => {
			//set admin state based on result of check
			//console.log("I'm an admin!")
			this.setState({ admin: result });
		})
		.catch((err) => {
			//if there was an error checking privileges, set to false
			//console.log("I'm not an admin!");
			this.setState({ admin: false });
		})
  }

  checkAdmin() {
    //get user ID for lookup in database table
    let uid = app.auth().currentUser.uid;
    return app.database().ref('/users/' + uid).once('value').then(function(snapshot) {
      //return whether the user has admin privileges
      if (snapshot.val().type === "admin") {
        return true;
      }
      else {
        return false;
      }
    });
    }


  render(){
    //let resType = '';
    let headerStyle = {
      fontFamily: "'Courier New', 'Courier', 'monospace'",
      fontSize: 36,
      fontWeight: "bold"
    }

    return(
      <div className="container">
        <Navbar collapseOnSelect style={{marginTop: '5px'}}>
            <Navbar.Header>
                <Navbar.Brand id="resourcesHeader" style={headerStyle}>Resources</Navbar.Brand>
                {/*<Navbar.Toggle />*/}
            </Navbar.Header>
        </Navbar>

        <PanelGroup
          accordion
          id="resources-list"
          activeKey={this.state.activeKey}
          onSelect={this.handleSelect}
        >
        <Panel eventKey="1">

          <Panel.Heading>
            <Panel.Title toggle>Job Opportunities</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal }>add info</button> : null} </Panel.Body>
        </Panel>

        <Panel eventKey="2">
          <Panel.Heading>
            <Panel.Title toggle>Affordable Housing</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}</Panel.Body>
        </Panel>
        <Panel eventKey="3">
          <Panel.Heading>
            <Panel.Title toggle>Short Term Housing</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}</Panel.Body>
          {/*<Panel.Body collapsible>
            <Panel eventKey="3.1">
              <Panel.Heading>
                <Panel.Title toggle>Food</Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>add food info</Panel.Body>
            </Panel>
          </Panel.Body>*/}
        </Panel>
        <Panel eventKey="4">
          <Panel.Heading>
            <Panel.Title toggle>Food</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}</Panel.Body>
        </Panel>
        <Panel eventKey="5">
          <Panel.Heading>
            <Panel.Title toggle>Education</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}</Panel.Body>
        </Panel>
      </PanelGroup>
      {this.state.createResource && <CreateResource myProp={this.state.resType} closeThreadModal={this.toggleResourceModal}/>}
      </div>


    );
  }

}
