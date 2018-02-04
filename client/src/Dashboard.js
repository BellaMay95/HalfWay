import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name
        }
    }

    render() {
        return (
            <div className="container">
                <h1>Welcome, {this.state.name}</h1>
            </div>
        );
    }
}

export default Dashboard;