import React, { Component } from 'react';
import { Navbar, Panel, PanelGroup } from 'react-bootstrap';
import { app } from '../base';
import CreateResource from './CreateResource';
import ResourceComponent from './ResourceComponent';


export default class Resources extends Component{


  constructor(props) {
    super(props);
    //let resType = '';
    this.handleSelect = this.handleSelect.bind(this);
    this.checkAdmin = this.checkAdmin.bind(this);
    this.toggleResourceModal = this.toggleResourceModal.bind(this);
    this.databaseJ = app.database().ref().child('resources').child('job');
    this.databaseA = app.database().ref().child('resources').child('affordablehousing');
    this.databaseS = app.database().ref().child('resources/shorttermhousing');
    this.databaseF = app.database().ref().child('resources/food');
    this.databaseE = app.database().ref().child('resources/education');

    this.state = {
      activeKey: 'null',
      createResource: false,
      resType: '',
      jobArr: [],
      affHouseArr: [],
      stHouseArr: [],
      foodArr: [],
      eductionArr: [],
    }
  }

  handleSelect(activeKey) {
    console.log(activeKey);
    let resType;
    if (activeKey == 1)
    {
      this.setState({ resType: 'job' });
    }
    if (activeKey == 2)
    {
      this.setState({ resType: 'affordablehousing' });
    }
    if (activeKey == 3)
    {
      this.setState({ resType: 'shorttermhousing' });
    }
    if (activeKey == 4)
    {
      this.setState({ resType: 'food' });
    }
    if (activeKey == 5)
    {
      this.setState({ resType: 'education' });
    }
    this.setState({ activeKey: activeKey });

  }

  toggleResourceModal(activeKey) {
      this.setState({createResource: !this.state.createResource});
  }

  componentWillMount() {

/* this section outlines the set up for the job section to pull from database*/
          var prevJob = this.state.jobArr;
            // Set previousForum to current state

          // Get DataSnapshot every time a child is added to the array
          this.databaseJ.on('child_added', snap => {
            prevJob.push({
              id: snap.key,
              author_id: snap.val().author_id,
              //author_name: snap.val().author_name,
              message: snap.val().message,
              subject: snap.val().subject,
              timestamp: this.getDateTime(snap.val().timestamp),
            })

            //reverse the array to show newest posts first
            prevJob = prevJob.reverse();
            // Push the array that we have just updated (previousForum) to the state
            this.setState({
              jobArr: prevJob
            })
          })

/* this section outlines the set up for the job section to pull from database*/
  var prevAffH = this.state.affHouseArr;
  // Set previousForum to current state

  // Get DataSnapshot every time a child is added to the array
  this.databaseA.on('child_added', snap => {
    prevAffH.push({
      id: snap.key,
      author_id: snap.val().author_id,
      //author_name: snap.val().author_name,
      message: snap.val().message,
      subject: snap.val().subject,
      timestamp: this.getDateTime(snap.val().timestamp),
      })

      //reverse the array to show newest posts first
      prevAffH = prevAffH.reverse();
      // Push the array that we have just updated (previousForum) to the state
      this.setState({
        affHouseArr: prevAffH
        })
      })

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

  getDateTime(timestamp) {
      let DateObj = new Date(timestamp);
      let formattedDate = DateObj.toLocaleString();
      return formattedDate;
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
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal }>add info</button> : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.jobArr.map((job , index) => {
               let thread_id = "thread_" + index;
               return(
                 <ResourceComponent author_name={job.author_name} message={job.message} subject={job.subject} timestamp = {job.timestamp}/>
               )
           })
          }


          </Panel.Body>
        </Panel>

        <Panel eventKey="2">
          <Panel.Heading>
            <Panel.Title toggle>Affordable Housing</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.affHouseArr.map((aff , index) => {
               let thread_id = "thread_" + index;
               return(
                 <ResourceComponent author_name={aff.author_name} message={aff.message} subject={aff.subject} timestamp = {aff.timestamp}/>
               )
           })
          }

          </Panel.Body>
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
