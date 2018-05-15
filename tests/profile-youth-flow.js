oldDisplay = "Jessica Rabbit";
newDisplay = "Jessica Bunny";

oldPassword = "Password1!";

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
        //reset back to original name
        browser.click("#settings");
        //edit profile
        browser.click('#editProfileDropdown');
        browser.click('#editProfile');
        browser.clearValue('#formControlsProfileName');
        browser.setValue('#formControlsProfileName', oldDisplay);
        browser.setValue('#formControlsConfirmPassword', oldPassword);
        browser.click('#submitProfile');

        //wait for alert to display message
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Profile Changes Successfully Submitted for Review!");
        browser.waitForElementNotPresent('.alert', 5000);

        //log out and login as admin to approve changes
        browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
        browser.assert.urlEquals('http://localhost:3000/login');
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "halfway@halfway.com");
        browser.setValue('input[name="password"]', oldPassword);
        browser.click('#loginButton');
        //give time for page to load and login
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server
        //accept pending changes
        browser.click('#admin');
        browser.click('#select-func');
        browser.click('#profile');
        browser.click('#viewProfile0');
        browser.setValue('#formControlsPassword', "Password1!");
        browser.pause(8000);
        browser.click('#acceptChanges');
        browser.waitForElementPresent('.alert', 25000);
        browser.expect.element('.alert').text.to.equal("Profile Changes Approved!");
        browser.waitForElementNotPresent('.alert', 5000);

        //logout as admin
        browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');

        //end the session
		browser.end();
    },

    'view own profile as youth': (browser) => {
        //navigate to profile
        browser.click('#settings');
        browser.waitForElementPresent('.brandProfile', 2000);

        //check for values on profile
        browser.expect.element('#userDisplay').text.to.equal("Display Name: " + oldDisplay);
        browser.expect.element('#userType').text.to.equal("User Role: youth");
        //email is only present on user's own profile
        browser.expect.element('#userEmail').to.be.present;
        browser.expect.element('#userEmail').text.to.equal("Email: jessie4ever@halfway.com");
        //edit profile dropdown only visible on own profile
        browser.expect.element('#editProfileDropdown').to.be.present;
    },

    'check for pending changes as youth (none exist)': (browser) => {
        browser.click('#settings');
        browser.waitForElementPresent('.brandProfile', 2000);
        browser.click('#editProfileDropdown');
        browser.click('#viewPending');

        browser.expect.element('.modal-body').text.to.equal("No pending changes on your profile. Submit some now!");
        browser.click('#closeModal');
    },

    'edit profile (no password)': (browser) => {
        browser.click('#settings');

        //edit profile
        browser.click('#editProfileDropdown');
        browser.click('#editProfile');
        //browser.setValue('input[type="file"]', require('path').resolve('/home/gabrielle/Dropbox/ezgif.com-add-text.gif'));
        browser.clearValue('#formControlsProfileName');
        browser.setValue('#formControlsProfileName', "Jessica Rabbitz");
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
        //browser.setValue('input[type="file"]', require('path').resolve('/home/gabrielle/Dropbox/ezgif.com-add-text.gif'));
        browser.clearValue('#formControlsProfileName');
        browser.setValue('#formControlsProfileName', "Jessica Rabbitz");
        browser.setValue('#formControlsConfirmPassword', oldPassword);
        browser.click('#submitProfile');

        //wait for alert to display message
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Profile Changes Successfully Submitted for Review!");
        browser.waitForElementNotPresent('.alert', 5000);

        //logout as youth
        browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
    },

    'view pending changes as admin': (browser) => {
        //login as admin
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "halfway@halfway.com");
        browser.setValue('input[name="password"]', oldPassword);
        browser.click('#loginButton');
        //give time for page to load and login
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/');

        browser.click('#admin');
        browser.click('#select-func');
        browser.click('#profile');
        browser.expect.element('#viewProfile0').to.be.present;
    },

    'reject pending changes as admin no password': (browser) => {
        browser.click('#admin');
        browser.click('#select-func');
        browser.click('#profile');
        browser.click('#viewProfile0');
        browser.pause(8000);
        browser.click('#rejectChanges');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("You Must Enter Your Password!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'reject pending changes as admin no reason': (browser) => {
        browser.click('#admin');
        browser.click('#select-func');
        browser.click('#profile');
        browser.click('#viewProfile0');
        browser.pause(8000);
        browser.setValue('#formControlsPassword', "password");
        browser.click('#rejectChanges');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("You Must Provide a Reason for Rejection in the Comments Field Below!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'reject pending changes as admin wrong password': (browser) => {
        browser.click('#admin');
        browser.click('#select-func');
        browser.click('#profile');
        browser.click('#viewProfile0');
        browser.pause(8000);
        browser.clearValue('#formControlsPassword');
        browser.setValue('#formControlsComments', "don't like this");
        browser.setValue('#formControlsPassword', "password");
        browser.click('#rejectChanges');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Invalid Password!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'reject pending changes as admin success': (browser) => {
        browser.click('#admin');
        browser.click('#select-func');
        browser.click('#profile');
        browser.click('#viewProfile0');
        browser.pause(8000);
        browser.clearValue('#formControlsComments');
        browser.clearValue('#formControlsPassword');
        browser.setValue('#formControlsComments', "don't like this");
        browser.setValue('#formControlsPassword', "Password1!");
        browser.click('#rejectChanges');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Successfully rejected profile changes!");
        browser.waitForElementNotPresent('.alert', 5000);

        //log out as admin
        browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
    },

    'view pending/rejected changes as youth and resubmit': (browser) => {
        //login as youth
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "jessie4ever@halfway.com");
        browser.setValue('input[name="password"]', oldPassword);
        browser.click('#loginButton');
        //give time for page to load and login
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/');

        //view rejected changes
        browser.click('#settings')
        browser.waitForElementPresent('.brandProfile', 2000);
        browser.click('#editProfileDropdown');
        browser.click('#viewPending');
        browser.pause(3000); //wait for body to populate
        browser.expect.element('.modal-body').text.to.contain("don't like this");
        browser.expect.element('.modal-body').text.to.contain("rejected");
        browser.click('#closeModal');

        //re-submit changes
        browser.click('#editProfileDropdown');
        browser.click('#editProfile');
        browser.setValue('#formControlsProfileName', "");
        browser.clearValue('#formControlsProfileName');
        browser.setValue('#formControlsProfileName', newDisplay);
        browser.setValue('#formControlsConfirmPassword', oldPassword);
        browser.click('#submitProfile');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Profile Changes Successfully Submitted for Review!");
        browser.waitForElementNotPresent('.alert', 5000);

        //logout as youth
        browser.click('#logout');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
    },

    'accept pending changes as admin': (browser) => {
        //login as admin
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "halfway@halfway.com");
        browser.setValue('input[name="password"]', oldPassword);
        browser.click('#loginButton');
        //give time for page to load and login
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/');

        //accept pending changes
        browser.click('#admin');
        browser.click('#select-func');
        browser.click('#profile');
        browser.click('#viewProfile0');
        browser.setValue('#formControlsPassword', "Password1!");
        browser.pause(8000);
        browser.click('#acceptChanges');
        browser.waitForElementPresent('.alert', 25000);
        browser.expect.element('.alert').text.to.equal("Profile Changes Approved!");
        browser.waitForElementNotPresent('.alert', 5000);

        //logout as admin
        browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
    },

    'view own profile with applied changes as youth': (browser) => {
        //login as youth
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "jessie4ever@halfway.com");
        browser.setValue('input[name="password"]', oldPassword);
        browser.click('#loginButton');
        //give time for page to load and login
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/');

        //view profile changes
        browser.click('#settings');
        browser.waitForElementPresent('.brandProfile', 2000);

        //check for values on profile
        browser.expect.element('#userDisplay').text.to.equal("Display Name: " + newDisplay);
        browser.expect.element('#userType').text.to.equal("User Role: youth");
        //email is only present on user's own profile
        browser.expect.element('#userEmail').to.be.present;
        browser.expect.element('#userEmail').text.to.equal("Email: jessie4ever@halfway.com");
        //edit profile dropdown only visible on own profile
        browser.expect.element('#editProfileDropdown').to.be.present;
    }
}