module.exports = {
	beforeEach : function(browser) {
		//console.log("refreshing window!");
		browser.refresh();
		browser.timeoutsImplicitWait(10000);
	},

	'get to login page': (browser) => {
		// Load the page at the launch URL
		browser
			.url(browser.launchUrl)
			.assert.urlEquals('http://localhost:3000/login'); //change for prod server
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

	'logging in with valid credentials': (browser) => {
		browser.setValue('input[name="email"]', "halfway@halfway.com");
		browser.setValue('input[name="password"]', "Password1!");
		browser.click('#loginButton');
		browser.pause(3000);
		browser.assert.urlEquals('http://localhost:3000/'); //change for prod server
	},
	
	'logging out': (browser) => {
		browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
		browser.end();
	}
}