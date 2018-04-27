import React, { Component } from 'react';
import { Navbar, Panel, PanelGroup, Alert } from 'react-bootstrap';
import { app } from '../base';
import CreateResource from './CreateResource';
import ResourceComponent from './ResourceComponent';
import './Resources.css';

export default class Resources extends Component{


  constructor(props) {
    super(props);
    //let resType = '';
    this.handleSelect = this.handleSelect.bind(this);
    this.checkAdmin = this.checkAdmin.bind(this);
    this.toggleResourceModal = this.toggleResourceModal.bind(this);
    this.resourceAlert = this.resourceAlert.bind(this);
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
      alertState: null
    }
  }

  handleSelect(activeKey) {
    //console.log(typeof activeKey);
    //console.log(activeKey);
    //let resType;
    if (activeKey === "1")
    {
      this.setState({ resType: 'job' });
    }
    if (activeKey === "2")
    {
      this.setState({ resType: 'affordablehousing' });
    }
    if (activeKey === "3")
    {
      this.setState({ resType: 'shorttermhousing' });
    }
    if (activeKey === "4")
    {
      this.setState({ resType: 'food' });
    }
    if (activeKey === "5")
    {
      this.setState({ resType: 'education' });
    }
    this.setState({ activeKey: activeKey });

  }

  toggleResourceModal(activeKey) {
      this.setState({createResource: !this.state.createResource});
  }

  resourceAlert(message, status) {
    this.setState({ alertState: <Alert bsStyle={status}>{message}</Alert>});

   window.setTimeout(() => {
        this.setState({ alertState: null });
    }, 5000);
  }

  componentWillMount() {

/* this section outlines the set up for the job section to pull from database*/
          var prevJob = this.state.jobArr;
            // Set previousForum to current state

          // Get DataSnapshot every time a child is added to the array
          this.databaseJ.on('child_added', snap => {
            prevJob.unshift({
              id: snap.key,
              author_id: snap.val().author_id,
              //author_name: snap.val().author_name,
              message: snap.val().message,
              subject: snap.val().subject,
              timestamp: this.getDateTime(snap.val().timestamp),
            })
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
    prevAffH.unshift({
      id: snap.key,
      author_id: snap.val().author_id,
      //author_name: snap.val().author_name,
      message: snap.val().message,
      subject: snap.val().subject,
      timestamp: this.getDateTime(snap.val().timestamp),
      })
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
        prevSTH.unshift({
          id: snap.key,
          author_id: snap.val().author_id,
          //author_name: snap.val().author_name,
          message: snap.val().message,
          subject: snap.val().subject,
          timestamp: this.getDateTime(snap.val().timestamp),
          })

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
      prevFood.unshift({
        id: snap.key,
        author_id: snap.val().author_id,
        //author_name: snap.val().author_name,
        message: snap.val().message,
        subject: snap.val().subject,
        timestamp: this.getDateTime(snap.val().timestamp),
      })
      // Push the array that we have just updated (previousForum) to the state
      this.setState({
        foodArr: prevFood
      })
    })

    //this is the remove section of the food
    this.databaseF.on('child_removed', snap => {
      for(var i=0; i < prevFood.length; i++){
        if (prevFood[i].id === snap.key){
          prevFood.splice(i,1);
        }
      }
        this.setState({
          foodArr: prevFood
          })
        })

    /*this section outlines for education section of resources*/
        var prevEducation = this.state.educationArr;
            // Set previousForum to current state
              // Get DataSnapshot every time a child is added to the array
        this.databaseE.on('child_added', snap => {
          prevEducation.unshift({
            id: snap.key,
            author_id: snap.val().author_id,
            //author_name: snap.val().author_name,
            message: snap.val().message,
            subject: snap.val().subject,
            timestamp: this.getDateTime(snap.val().timestamp),
          })
          // Push the array that we have just updated (previousForum) to the state
          this.setState({
            educationArr: prevEducation
          })
        })
        //this is the remove section of the education
        this.databaseE.on('child_removed', snap => {
          for(var i=0; i < prevEducation.length; i++){
            if (prevEducation[i].id === snap.key){
              prevEducation.splice(i,1);
            }
          }
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
		//check user token for account type
		return app.auth().currentUser.getIdToken()
        .then((idToken) => {
            // Parse the ID token.
            idToken = idToken.replace(/-/g, "+").replace(/_/g, "/");
			const payload = JSON.parse(atob(idToken.split('.')[1]));
			if (payload['type'] === "admin") {
				return true;
			} else {
				return false;
			}
		})
		.catch((err) => {
			console.log("couldn't get token!");
			console.log(err);
			return false; //if we can't determine, say they aren't an admin
		})
  }


  render(){
    return(
      <div className="container">
        <Navbar className="navbarResources" collapseOnSelect style={{marginTop: '5px'}}>
            <Navbar.Header>
              <span><h3 className="brandResources">Resources</h3></span>
                {/*<Navbar.Toggle />*/}
            </Navbar.Header>
        </Navbar>

        {this.state.alertState}

        <PanelGroup
          accordion
          id="resources-list"
          activeKey={this.state.activeKey}
          onSelect={this.handleSelect}
          bsStyle="primary"
        >
        <Panel eventKey="1">

          <Panel.Heading>
            <Panel.Title toggle><h4>Job Opportunities</h4></Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" id="addJobResource" className="btn btn-info" onClick={this.toggleResourceModal }>add info</button>  : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.jobArr.map((job , index) => {
               return(
                <div key={job.id}>
                 <ResourceComponent showAlert={this.resourceAlert} index={index} resource_id={job.id} author_name={job.author_name} message={job.message} subject={job.subject} timestamp = {job.timestamp} resIdentifier = {1}/>
               </div>
               )
           })
          }


          </Panel.Body>
        </Panel>

        <Panel eventKey="2">
          <Panel.Heading>
            <Panel.Title toggle><h4>Affordable Housing</h4></Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" id="addAffHousingResource" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.affHouseArr.map((aff , index) => {
               return(
                 <div key={aff.id}>
                 <ResourceComponent showAlert={this.resourceAlert} index={index} resource_id={aff.id} author_name={aff.author_name} message={aff.message} subject={aff.subject} timestamp = {aff.timestamp} resIdentifier = {2}/>
                 </div>
               )
           })
          }

          </Panel.Body>
        </Panel>
        <Panel eventKey="3">
          <Panel.Heading>
            <Panel.Title toggle><h4>Short Term Housing</h4></Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" id="addStHousingResource" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.stHouseArr.map((sth , index) => {
               return(
                 <div key={sth.id}>
                 <ResourceComponent showAlert={this.resourceAlert} index={index} resource_id={sth.id} author_name={sth.author_name} message={sth.message} subject={sth.subject} timestamp = {sth.timestamp} resIdentifier = {3}/>
                 </div>
               )
           })
          }
          </Panel.Body>

        </Panel>
        <Panel eventKey="4">
          <Panel.Heading>
            <Panel.Title toggle><h4>Food</h4></Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" id="addFoodResource" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.foodArr.map((food , index) => {
               return(
                 <div key={food.id}>
                 <ResourceComponent index={index} showAlert={this.resourceAlert} resource_id={food.id} author_name={food.author_name} message={food.message} subject={food.subject} timestamp = {food.timestamp} resIdentifier = {4}/>
                 </div>
               )
           })
          }

          </Panel.Body>
        </Panel>
        <Panel eventKey="5">
          <Panel.Heading>
            <Panel.Title toggle><h4>Education</h4></Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>{this.state.admin ? <button type="button" id="addEducationResource" className="btn btn-info" onClick={this.toggleResourceModal}>add info</button> : null}
          {
            /*Going through the array and displaying all of the forums in a panel view*/
           this.state.educationArr.map((edu , index) => {
               return(
                 <div key={edu.id}>
                 <ResourceComponent index={index} showAlert={this.resourceAlert} resource_id={edu.id} author_name={edu.author_name} message={edu.message} subject={edu.subject} timestamp = {edu.timestamp} resIdentifier = {5}/>
                 </div>
               )
           })
          }
          </Panel.Body>
        </Panel>
      </PanelGroup>
      {this.state.createResource && <CreateResource myProp={this.state.resType} showAlert={this.resourceAlert} closeThreadModal={this.toggleResourceModal}/>}
      </div>


    );
  }

}
