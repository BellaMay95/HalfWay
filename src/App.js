import React, { Component } from 'react';
import { Redirect, BrowserRouter, Route } from 'react-router-dom';
import { app } from './base';
import { Spinner } from 'react-spinner';
//import logo from './logo.svg';

import './App.css';

import Top from './components/Top';
import Login from './components/Login';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';

function AuthenticatedRoute({component: Component, authenticated, ...rest}) {
	return (
	  <Route
		{...rest}
		render={(props) => authenticated === true
			? <Component {...props} {...rest} />
			: <Redirect to={{pathname: '/login', state: {from: props.location}}} />} />
	)
}

class App extends Component {
	constructor(props) {
		super();
		this.setCurrentUser = this.setCurrentUser.bind(this);
		this.state = {
			authenticated: false,
			currentUser: null,
			name: '',
			loading: true
		};
	}

	componentWillMount() {
		this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					authenticated: true,
					currentUser: user,
					loading: false
				})
			} else {
				this.setState({
					authenticated: false,
					currentUser: null,
					loading: false
				})
			}
		})
	}

	componentWillUnmount() {
		this.removeAuthListener();
	}

	setCurrentUser(user) {
		if (user) {
			this.setState({
				currentUser: user,
				authenticated: true
			})
		} else {
			this.setState({
				currentUser: null,
				authenticated: false
			})
		}
	}

	render() {
		if (this.state.loading === true) {
			return (
				<div>
					<h3>Loading</h3>
					
				</div>
			)
		}
		/*let mainPage;
		if (!this.state.isLoggedIn) {
			console.log("we're not logged in");
			mainPage = <Login setLoginState={this.setLoginState} />;
		}
		if (this.state.isLoggedIn) {
			console.log("we are logged in");
			mainPage = <Dashboard name={this.state.name} />;
		}*/
		return (
			<div className="App">
				<BrowserRouter>
					<div>
						{/*<Top authenticated={this.state.authenticated} name={this.state.currentUser} />*/}
						<Route exact path="/login" render={(props) => {
							return <Login setCurrentUser={this.setCurrentUser} {...props} />
						}} />
						<Route exact path="/logout" component={Logout} />
						<AuthenticatedRoute
							exact
							path="/"
							authenticated={this.state.authenticated}
							component={Dashboard}
						/>
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;