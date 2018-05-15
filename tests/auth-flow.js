module.exports = {
	beforeEach : function(browser) {
		//console.log("refreshing window!");
		browser.refresh();
		browser.timeoutsImplicitWait(10000);
	},

	'get to login page': (browser) => {
		// Load the page at the launch URL
		browser.url(browser.launchUrl);
		browser.assert.urlEquals('http://localhost:3000/login'); //change for prod server
		browser.waitForElementPresent('input[name="email"]', 5000);
	},

	/*'logging in with empty password': (browser) => {
		browser.setValue('input[name="email"]', 'halfway@google.com');

		browser.clearValue('input[name="password"]');
		browser.click('#loginButton');
		browser.waitForElementPresent('.alert', 1000);
		//browser.expect.element('.alert').to.be.present;
		browser.expect.element('.alert').text.to.equal("One or more required fields are empty");
		browser.waitForElementNotPresent('.alert', 5000);
		browser.clearValue('input[name="email"]');
		browser.clearValue('input[name="password"]');
	},*/

	'logging in with empty email': (browser) => {
		browser.clearValue('input[name="email"]');

		//browser.setValue('input[name="email"', "");
		browser.setValue('input[name="password"]', 'iamthepassword');
		browser.click('#loginButton');
		browser.waitForElementPresent('.alert', 1000);
		//browser.expect.element('.alert').to.be.present
		browser.expect.element('.alert').text.to.equal("One or more required fields are empty");
		browser.waitForElementNotPresent('.alert', 5000);
		browser.clearValue('input[name="email"]');
		browser.clearValue('input[name="password"]');
	},

	'logging in with invalid email format': (browser) => {
		browser.setValue('input[name="email"]', 'imposter');
		browser.setValue('input[name="password"]', 'hackmein!');
		browser.click('#loginButton');
		browser.waitForElementPresent('.alert', 1000);
		//browser.expect.element('.alert').to.be.present
		browser.expect.element('.alert').text.to.equal("You must enter a valid email address!");
		browser.clearValue('input[name="email"]');
		browser.clearValue('input[name="password"]');
	},

	'logging in with invalid username and invalid password': (browser) => {
		browser.setValue('input[name="email"]', 'imposter@halfway.com');
		browser.setValue('input[name="password"]', 'hackmein!');
		browser.click('#loginButton');
		browser.waitForElementPresent('.alert', 1000);
		//browser.expect.element('.alert').to.be.present
		browser.expect.element('.alert').text.to.equal("Invalid Login Credentials!");
		browser.clearValue('input[name="email"]');
		browser.clearValue('input[name="password"]');
	},

	/*'logging in with invalid username and valid password': (browser) => {
		browser.setValue('input[name="email"]', 'imposter@halfway.com');
		browser.setValue('input[name="password"]', 'Password1!');
		browser.click('#loginButton');
		browser.waitForElementPresent('.alert', 1000);
		//browser.expect.element('.alert').to.be.present
		browser.expect.element('.alert').text.to.equal("Invalid Login Credentials!");
		browser.clearValue('input[name="email"]');
		browser.clearValue('input[name="password"]');
	},

	'logging in with valid username and invalid password': (browser) => {
		browser.setValue('input[name="email"]', 'halfway@halfway.com');
		browser.setValue('input[name="password"]', 'hackmein!');
		browser.click('#loginButton');
		browser.waitForElementPresent('.alert', 1000);
		//browser.expect.element('.alert').to.be.present
		browser.expect.element('.alert').text.to.equal("Invalid Login Credentials!");
		browser.clearValue('input[name="email"]');
		browser.clearValue('input[name="password"]');
	},*/

	'logging in with valid credentials as admin': (browser) => {
		browser.setValue('input[name="email"]', "halfway@halfway.com");
		browser.setValue('input[name="password"]', "Password1!");
		browser.click('#loginButton');
		browser.pause(3000);
		browser.assert.urlEquals('http://localhost:3000/'); //change for prod server
	},

	'checking for admin panel (as admin)': (browser) => {
		browser.expect.element('#admin').to.be.present;
	},

	'checking for resources add/edit (as admin)': (browser) => {
		browser.click('#resources');
		browser.click('#resources-list-heading-2');
		browser.expect.element('.btn-info').to.be.present;
		browser.expect.element('.deleteResource').to.be.present;
	},

	
	'logging out (admin)': (browser) => {
		browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
	},

	'logging in with valid credentials as youth': (browser) => {
		browser.setValue('input[name="email"]', "jessie4ever@halfway.com");
		browser.setValue('input[name="password"]', "Password1!");
		browser.click('#loginButton');
		browser.pause(3000);
		browser.assert.urlEquals('http://localhost:3000/'); //change for prod server
	},

	'checking for admin panel (as youth)': (browser) => {
		browser.expect.element('#admin').to.not.be.present;
	},

	'checking for resources add/edit (as youth)': (browser) => {
		browser.click('#resources');
		browser.click('#resources-list-heading-2');
		browser.expect.element('.btn-info').to.not.be.present;
		browser.expect.element('.deleteResource').to.not.be.present;
	},

	'logging out (youth)': (browser) => {
		browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
		browser.end();
	}
}