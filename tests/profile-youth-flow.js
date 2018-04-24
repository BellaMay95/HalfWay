oldDisplay = "Jessica Rabbit";
newDisplay = "Jessica Bunny";

oldPassword = "Password1!";
newPassword = "Password1!";

module.exports = {
    before: (browser) => {
        //launch browser
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        //login to website
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "jessie4ever@halfway.com");
        browser.setValue('input[name="password"]', oldPassword);
        browser.click('#loginButton');
        //give time for page to load and login
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server
    },

    beforeEach : (browser) => {
		//refresh the window before each test
		browser.refresh();
		browser.timeoutsImplicitWait(15000);
    },

    after: (browser) => {
        //log out and end the session
        browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
		browser.end();
    },

    'view own profile': (browser) => {
        //navigate to profile
        browser.click('#settings');
        browser.waitForElementPresent('.brandProfile', 2000);

        //check for values on profile
        browser.expect.element('#userDisplay').text.to.equal("Display Name: " + oldDisplay);
        browser.expect.element('#userType').text.to.equal("User Role: admin");
        //email is only present on user's own profile
        browser.expect.element('#userEmail').to.be.present;
        browser.expect.element('#userEmail').text.to.equal("Email: jessie4ever@halfway.com");
        //edit profile dropdown only visible on own profile
        browser.expect.element('#editProfileDropdown').to.be.present;
    },

    'edit profile (no password)': (browser) => {
        browser.click('#settings');

        //edit profile
        browser.click('#editProfileDropdown');
        browser.click('#editProfile');
        browser.setValue('input[type="file"]', require('path').resolve('/home/gabrielle/Dropbox/ezgif.com-add-text.gif'));
        browser.clearValue('#formControlsProfileName');
        browser.setValue('#formControlsProfileName', newDisplay);
        browser.click('#submitProfile');

        //wait for alert to display message
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Enter your current password!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'edit profile success': (browser) => {
        browser.click("#settings");
        //edit profile
        browser.click('#editProfileDropdown');
        browser.click('#editProfile');
        browser.setValue('input[type="file"]', require('path').resolve('/home/gabrielle/Dropbox/ezgif.com-add-text.gif'));
        browser.clearValue('#formControlsProfileName');
        browser.setValue('#formControlsProfileName', newDisplay);
        browser.setValue('#formControlsConfirmPassword', oldPassword);
        browser.click('#submitProfile');

        //wait for alert to display message
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Profile Edited Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);
    },
}