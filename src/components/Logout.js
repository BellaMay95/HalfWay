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
        app.auth().signOut().then((user, error) => {
            this.setState({
                redirect: true
            })
        })
    }

    render() {
        if (this.state.redirect === true) {
            return <Redirect to="/" />
        }

        return (
            <h3> Logging Out! </h3>
        )
    }
}

export default Logout;