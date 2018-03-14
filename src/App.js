import React, { Component } from 'react';
import { Redirect, BrowserRouter, Route } from 'react-router-dom';
import { app } from './base';
import { Spinner } from 'react-spinner';

import './App.css';

import Login from './components/Login';
import Logout from './components/Logout';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function AuthenticatedRoute({component: Component, authenticated, ...rest}) {
	/*if authenticated, load requested component/route, otherwise redirect to login route*/

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
		super(props);
		this.setCurrentUser = this.setCurrentUser.bind(this);
		//get state from props if they exist (for testing) otherwise set default starting values
		/*this.state = {
			authenticated: (this.props.authenticated ? this.props.authenticated : false),
			currentUser: (this.props.currentUser ? this.props.currentUser : null),
			name: (this.props.name ? this.props.name : ''),
			loading: (this.props.loading ? this.props.loading : true)
		};*/
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
		});
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
					{ Spinner }
				</div>
			)
		}
		return (
			<div className="App">
				{/* BrowserRouter tag allows routes*/}
				<BrowserRouter>
					<div>
						{/* '/login' path returns login component */}
						<Route exact path="/login" render={(props) => {
							return <Login setCurrentUser={this.setCurrentUser} {...props} />
						}} />
						{/* 'logout' path returns logout component */}
						<Route exact path="/logout" component={Logout} />
						{/*the rest of the routes are protected. If the user is not logged in, it redirects to the login page */}
						<AuthenticatedRoute
							exact
							path="/"
							authenticated={this.state.authenticated}
							component={Sidebar}
						/>
						<AuthenticatedRoute
							exact
							path="/navbar"
							authenticated={this.state.authenticated}
							component={Navbar}
						/>

					</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
