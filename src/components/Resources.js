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
    this.databaseS = app.database().ref().child('resources').child('shorttermhousing');
    this.databaseF = app.database().ref().child('resources').child('food');
    this.databaseE = app.database().ref().child('resources').child('education');

    this.state = {
      activeKey: 'null',
      createResource: false,
      resType: '',
      jobArr: [],
      affHouseArr: [],
      stHouseArr: [],
      foodArr: [],
      educationArr: [],
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
            //prevJob = prevJob.reverse();
            // Push the array that we have just updated (previousForum) to the state
            this.setState({
              jobArr: prevJob
            })
          })

          //remove section of jobs section
          this.databaseJ.on('child_removed', snap => {
            for(var i=0; i < prevJob.length; i++){
              if (prevJob[i].id === snap.key){
                console.log("snap.key:: " + snap.key);
                console.log("prevJob[i].id: " + prevJob[i].id);
                console.log("i: " + i);
                prevJob.splice(i,1);
              }
            }

            this.setState({
              jobArr: prevJob
            })
          })

/* this section outlines the set up for the affordablehousing section to pull from database*/
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
      //prevAffH = prevAffH.reverse();
      // Push the array that we have just updated (previousForum) to the state
      this.setState({
        affHouseArr: prevAffH
        })
      })
//remove section of afforable Housing
this.databaseA.on('child_removed', snap => {
  for(var i=0; i < prevAffH.length; i++){
    if (prevAffH[i].id === snap.key){
      prevAffH.splice(i,1);
    }
  }

    this.setState({
      affHouseArr: prevAffH
      })
    })


/*this section outlines for short term housing section of resources*/
  var prevSTH = this.state.stHouseArr;
      // Set previousForum to current state

      // Get DataSnapshot every time a child is added to the array
      this.databaseS.on('child_added', snap => {
        prevSTH.push({
          id: snap.key,
          author_id: snap.val().author_id,
          //author_name: snap.val().author_name,
          message: snap.val().message,
          subject: snap.val().subject,
          timestamp: this.getDateTime(snap.val().timestamp),
          })

          //reverse the array to show newest posts first
          //prevAffH = prevAffH.reverse();
          // Push the array that we have just updated (previousForum) to the state
          this.setState({
            stHouseArr: prevSTH
            })
          })
//this is the remove section of the short term Housing
this.databaseS.on('child_removed', snap => {
  for(var i=0; i < prevSTH.length; i++){
    if (prevSTH[i].id === snap.key){
      prevSTH.splice(i,1);
    }
  }
    this.setState({
      stHouseArr: prevSTH
      })
    })


/*this section outlines for food section of resources*/
    var prevFood = this.state.foodArr;
        // Set previousForum to current state
          // Get DataSnapshot every time a child is added to the array
    this.databaseF.on('child_added', snap => {
      prevFood.push({
        id: snap.key,
        author_id: snap.val().author_id,
        //author_name: snap.val().author_name,
        message: snap.val().message,
        subject: snap.val().subject,
        timestamp: this.getDateTime(snap.val().timestamp),
      })
      //reverse the array to show newest posts first
      //prevAffH = prevAffH.reverse();
      // Push the array that we have just updated (previousForum) to the state
      this.setState({
        foodArr: prevFood
      })
    })

    /*this section outlines for education section of resources*/
        var prevEducation = this.state.educationArr;
            // Set previousForum to current state
              // Get DataSnapshot every time a child is added to the array
        this.databaseE.on('child_added', snap => {
          prevEducation.push({
            id: snap.key,
            author_id: snap.val().author_id,
            //author_name: snap.val().author_name,
            message: snap.val().message,
            subject: snap.val().subject,
            timestamp: this.getDateTime(snap.val().timestamp),
          })
          //reverse the array to show newest posts first
          //prevAffH = prevAffH.reverse();
          // Push the array that we have just updated (previousForum) to the state
          this.setState({
            educationArr: prevEducation
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
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal }>add info</button>  : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.jobArr.map((job , index) => {
               let thread_id = "thread_" + index;
               return(
                <div key={job.id}>
                 <ResourceComponent  resource_id={job.id} author_name={job.author_name} message={job.message} subject={job.subject} timestamp = {job.timestamp} resIdentifier = {1}/>
               </div>
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
                 <ResourceComponent resource_id={aff.id} author_name={aff.author_name} message={aff.message} subject={aff.subject} timestamp = {aff.timestamp} resIdentifier = {2}/>
               )
           })
          }

          </Panel.Body>
        </Panel>
        <Panel eventKey="3">
          <Panel.Heading>
            <Panel.Title toggle>Short Term Housing</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.stHouseArr.map((sth , index) => {
               let thread_id = "thread_" + index;
               return(
                 <ResourceComponent resource_id={sth.id} author_name={sth.author_name} message={sth.message} subject={sth.subject} timestamp = {sth.timestamp} resIdentifier = {3}/>
               )
           })
          }
          </Panel.Body>

        </Panel>
        <Panel eventKey="4">
          <Panel.Heading>
            <Panel.Title toggle>Food</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.foodArr.map((food , index) => {
               let thread_id = "thread_" + index;
               return(
                 <ResourceComponent resource_id={food.id} author_name={food.author_name} message={food.message} subject={food.subject} timestamp = {food.timestamp} resIdentifier = {4}/>
               )
           })
          }

          </Panel.Body>
        </Panel>
        <Panel eventKey="5">
          <Panel.Heading>
            <Panel.Title toggle>Education</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.educationArr.map((edu , index) => {
               let thread_id = "thread_" + index;
               return(
                 <ResourceComponent resource_id={edu.id} author_name={edu.author_name} message={edu.message} subject={edu.subject} timestamp = {edu.timestamp} resIdentifier = {5}/>
               )
           })
          }
          </Panel.Body>
        </Panel>
      </PanelGroup>
      {this.state.createResource && <CreateResource myProp={this.state.resType} closeThreadModal={this.toggleResourceModal}/>}
      </div>


    );
  }

}
