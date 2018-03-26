import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { app } from '../base';

class Logout extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false
        }
    }

    componentWillMount() {
        app.auth().signOut()
        .then((user, error) => {
            //console.log("logged out!");
            this.setState({
                redirect: true
            })
        })
        .catch((err) => {
            console.log("error logging out...");
            console.error(err);
        })
    }

    render() {
        if (this.state.redirect === true) {
            return <Redirect to="/login" />
        }

        return (
            <h3> Logging Out! </h3>
        )
    }
}

export default Logout;