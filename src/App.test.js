import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import { shallow, mount } from 'enzyme';
import App from './App';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Navbar from './components/Navbar';

import { app } from './base';

describe('App', () => {

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<App />, div);
	});

	it('redirects to login without auth', () => {
		let renderedComponent = mount(<App />);
		renderedComponent.setState({ loading: false, authenticated: false });
		//console.log(renderedComponent.debug());
		expect(renderedComponent.find(Login).length).toBe(1);
	});

	it('displays sidebar with auth', () => {
		const email = "halfway@google.com";
        const password = "password";

		app.auth().fetchProvidersForEmail(email)
		.then((providers) => {
			//tests whether account exists
			if (providers.length === 0) {
				console.log("This account does not exist!");
				return Promise.reject("Account doesn't exist");
			}
			//checks for valid password
			else if (providers.indexOf("password") === -1) {
				console.log("invalid login credentials!");
				return Promise.reject("Invalid credentials");
			} else {
				return app.auth().signInWithEmailAndPassword(email, password);
			}
		})
		.then((user) => {
			expect(user).toBeTruthy();
			let renderedComponent = mount(<App />);
			renderedComponent.setState({ loading: false });
			//console.log(renderedComponent.debug());
			expect(renderedComponent.find(Sidebar).length).toBe(1);
		})
		.then(() => {
			app.auth().signOut();
		})
		.catch((error) => {
			expect(true).toBeFalsy; //cause test to fail
		});
	})
});
