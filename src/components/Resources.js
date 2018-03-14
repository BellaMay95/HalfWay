import React, { Component } from 'react';
import { Navbar, Panel, PanelGroup } from 'react-bootstrap';


export default class Resources extends Component{
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      activeKey: '1'
    }
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }
  render(){
    let headerStyle = {
      fontFamily: "'Courier New', 'Courier', 'monospace'",
      fontSize: 36,
      fontWeight: "bold"
    }

    return(
      <div className="container">
        <Navbar collapseOnSelect style={{marginTop: '5px'}}>
            <Navbar.Header>
                <Navbar.Brand style={headerStyle}>Resources</Navbar.Brand>
                <Navbar.Toggle />
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
          <Panel.Body collapsible>Add info here for job ops</Panel.Body>
        </Panel>
        <Panel eventKey="2">
          <Panel.Heading>
            <Panel.Title toggle>Affordable Housing</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>add affordable housing info</Panel.Body>
        </Panel>
        <Panel eventKey="3">
          <Panel.Heading>
            <Panel.Title toggle>Short Term Housing</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>add short term housing info</Panel.Body>
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
          <Panel.Body collapsible>add food info</Panel.Body>
        </Panel>
        <Panel eventKey="5">
          <Panel.Heading>
            <Panel.Title toggle>Education</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>education</Panel.Body>
        </Panel>
      </PanelGroup>
      </div>


    );
  }

}
