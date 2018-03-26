import React from 'react';
import { mount } from 'enzyme';

import Login from '../Login';
import { Alert } from 'react-bootstrap';

describe('Login', () => {
    //first two tests + pre-test code is modified from https://medium.freecodecamp.org/the-right-way-to-test-react-components-548a4736ab22
    let props = {
        location: {
            pathname: "/login",
            state: {
                from: {
                    pathname: "/"
                }
            }
        }
    };

    it("always renders a div", () => {
        let renderedComponent = mount(
            <Login {...props} />);
        const divs = renderedComponent.find("div");
        expect(divs.length).toBeGreaterThan(0);
    });

    //refine test: it takes FOREVER and comes up with weird results
    /*it("rendered div contains everything", () => {
        let renderedComponent = mount(
            <Login {...props} />);
        const divs = renderedComponent.find("div");
        //const divs = login().find("div");
        const wrappingDiv = divs.first();
        //expect(wrappingDiv.children()).toEqual(login().children());
        expect(wrappingDiv.children()).toEqual(renderedComponent.children());
    });*/

    describe('Show Login State Alerts', () => {
        it('show alert for empty fields', () => {
            let renderedComponent = mount(
                <Login {...props} />);
    
            //set first warning
            renderedComponent.setState({ alertShow: 1 });
            expect(renderedComponent.find(Alert).text()).toMatch("One or more required fields are empty");
        });

        //changed component to login by username instead of email
        /*it('show alert for invalid email address regex', () => {
            let renderedComponent = mount(
                <Login {...props} />);

            renderedComponent.setState({ alertShow: 2 });
            expect(renderedComponent.find(Alert).text()).toMatch("Please enter a valid email address");
        });*/

        it('show alert for invalid login', () => {
            let renderedComponent = mount(
                <Login {...props} />);
    
            renderedComponent.setState({ alertShow: 2 });
            expect(renderedComponent.find(Alert).text()).toMatch("Invalid Login Credentials!");
        });
    });

    //test the login button thingy
    describe('check for valid login', () => {
        it('get alert for both empty fields', () => {
            let renderedComponent = mount(<Login {...props} />);

            renderedComponent.setState({ email: "", password: "" });
            let button = renderedComponent.find('.btn-primary .btn-default');
            //console.log(button.debug());
            
            button.simulate('submit');
            renderedComponent.update();
            expect(renderedComponent.find(Alert).text()).toMatch("One or more required fields are empty");
        });

        it('get alert for empty email field', () => {
            let renderedComponent = mount(<Login {...props} />);

            renderedComponent.setState({ email: "", password: "1234" });
            let button = renderedComponent.find('.btn-primary .btn-default');
            //console.log(button.debug());
            
            button.simulate('submit');
            renderedComponent.update();
            expect(renderedComponent.find(Alert).text()).toMatch("One or more required fields are empty");
        });

        it('get alert for empty password field', () => {
            let renderedComponent = mount(<Login {...props} />);

            renderedComponent.setState({ email: "hellokitty", password: "" });
            let button = renderedComponent.find('.btn-primary .btn-default');
            //console.log(button.debug());
            
            button.simulate('submit');
            renderedComponent.update();
            expect(renderedComponent.find(Alert).text()).toMatch("One or more required fields are empty");
        });

        //changed component to login by username instead of email
        /*it('get alert for invalid email format', () => {
            let renderedComponent = mount(<Login {...props} />);

            renderedComponent.setState({ email: "hellokitty", password: "password" });
            let button = renderedComponent.find('.btn-primary .btn-default');
            //console.log(button.debug());
            
            button.simulate('submit');
            renderedComponent.update();
            expect(renderedComponent.find(Alert).text()).toMatch("Please enter a valid email address");
        });*/

        //change to use mock firebase function
        /*it('get alert for invalid login credentials', () => {
            let renderedComponent = mount(<Login {...props} />);

            renderedComponent.setState({ email: "hellokitty@google.com", password: "password1" });
            //console.log(renderedComponent.state());
            let button = renderedComponent.find('.btn-primary .btn-default');
            //console.log(button.debug());
            
            button.simulate('submit');
            console.log(renderedComponent.debug());
            //renderedComponent.update();
            expect(renderedComponent.find(Alert).text()).toMatch("Invalid Login Credentials!");
        });*/

        //change to use mock firebase function
        /*it('get successful login', () => {
            let renderedComponent = mount(<Login {...props} />);

            renderedComponent.setState({ email: "halfway@google.com", password: "password" });
            let button = renderedComponent.find('#loginButton .btn');
            console.log(button.debug());

            button.simulate('submit');
            //renderedComponent.update();
            console.log(renderedComponent.state());
        })*/
    });
});