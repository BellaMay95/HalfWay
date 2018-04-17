import React, { Component } from 'react';

export default class ResetPassword extends Component {
    constructor() {
        super();

        this.reset = this.reset.bind(this);

        this.state = {
            username: "",
            email: "",
            newPassword: "",
            confirmPassword: ""
        }
    }

    reset() {
        console.log("resetting password later!");
    }

    render() {
        return(<h1>Reset Password Coming Soon!</h1>);
    }
}