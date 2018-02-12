import React, { Component } from 'react';

//import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //name: props.name.displayName
        }
    }

    render() {
        return (
            <div className="container">
                <h1>Welcome, User!</h1>
            </div>
        );
    }
}

export default Dashboard;