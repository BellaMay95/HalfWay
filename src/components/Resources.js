import React, { Component } from 'react';


export default class Resources extends Component{
  render(){
    return(
      <div class="container">
        <div class="panel-group" id="accordion">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">
                Job Opportunities</a>
              </h3>
            </div>
            <div id="collapse1" class="panel-collapse collapse in">
              <div class="panel-body">Add info here for job ops</div>
            </div>
          </div>
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">
                Affordable Housing</a>
              </h3>
            </div>
            <div id="collapse2" class="panel-collapse collapse">
              <div class="panel-body">add affordable housing info</div>
            </div>
          </div>
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">
                Short Term Housing</a>
              </h3>
            </div>
            <div id="collapse3" class="panel-collapse collapse">
              <div class="panel-body">add short term housing info</div>
            </div>
          </div>

          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">
                Food</a>
              </h3>
            </div>
            <div id="collapse4" class="panel-collapse collapse">
              <div class="panel-body">add food info</div>
            </div>
          </div>

          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">
                Education</a>
              </h3>
            </div>
            <div id="collapse5" class="panel-collapse collapse">
              <div class="panel-body">education</div>
            </div>
          </div>




        </div>
      </div>


    );
  }

}
