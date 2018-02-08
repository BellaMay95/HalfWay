import React, { Component } from 'react';

//import logo from './logo.svg';

import './App.css';

import Top from './Top';
import Login from './Login';
import Dashboard from './Dashboard';

class App extends Component {
	constructor(props) {
		super(props);
		this.setLoginState = this.setLoginState.bind(this);
		this.state = {
			response: '',
			isLoggedIn: false,
			name: ''
		};
	}

	/*componentDidMount() {
		this.callApi()
			.then(res => this.setState({ response: res.express }))
			.catch(err => console.log(err));
	}

	callApi = async () => {
		const response = await fetch('/api/hello');
		const body = await response.json();

		if (response.status !== 200) throw Error(body.message);

		return body;
	};*/

	setLoginState(loginSuccess, name) {
		console.log(loginSuccess + name);
		if (loginSuccess) {
			this.setState({name: name});
			this.setState({isLoggedIn: true});
		}
		else {
			this.setState({isLoggedIn: false});
		}
	}

	render() {
		console.log(this.state.isLoggedIn);
		let mainPage;
		if (!this.state.isLoggedIn) {
			mainPage = <Login setLoginState={this.setLoginState} />;
		}
		if (this.state.isLoggedIn) {
			console.log(this.state.name);
			mainPage = <Dashboard name={this.state.name} />;
		}
		console.log(mainPage);
		return (
			<div className="App">
				<Top setLoginState={this.setLoginState} isLoggedIn={this.state.isLoggedIn} name={this.state.name} />
				{mainPage}
			</div>
		);
	}
}

export default App;