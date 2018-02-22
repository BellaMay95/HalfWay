import React, { Component } from 'react';

//import './Dashboard.css';
import Sidebar from './Sidebar';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //name: props.name.displayName
        }
    }

    render() {
        return (
            <Sidebar />
        );
    }
}

export default Dashboard;