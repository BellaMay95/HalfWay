import React, { Component } from 'react';


export default class Resources extends Component{
  render(){
    return(
      <div className="container">
        <div className="panel-group" id="accordion">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">
                Job Opportunities</a>
              </h3>
            </div>
            <div id="collapse1" className="panel-collapse collapse in">
              <div className="panel-body">Add info here for job ops</div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">
                Affordable Housing</a>
              </h3>
            </div>
            <div id="collapse2" className="panel-collapse collapse">
              <div className="panel-body">add affordable housing info</div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">
                Short Term Housing</a>
              </h3>
            </div>
            <div id="collapse3" className="panel-collapse collapse">
              <div className="panel-body">add short term housing info</div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">
                Food</a>
              </h3>
            </div>
            <div id="collapse4" className="panel-collapse collapse">
              <div className="panel-body">add food info</div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">
                Education</a>
              </h3>
            </div>
            <div id="collapse5" className="panel-collapse collapse">
              <div className="panel-body">education</div>
            </div>
          </div>




        </div>
      </div>


    );
  }

}
