let oldPassword = "Password1!";
let newPassword = "Password!1";

let oldDisplay = "Jane Q. Adminz";
let newDisplay = "Janie Q. Adminzing";



module.exports = {
    before: (browser) => {
        //launch browser
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        //login to website
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "halfway@halfway.com");
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
        //restore profile
        //get to change password screen
        browser.click('#settings');
        browser.click('#editProfileDropdown');
        browser.click('#changePassword');

        //fill out form and submit
        browser.clearValue('#formControlsCurrent')
        browser.clearValue('#formControlsNew');
        browser.clearValue('#formControlsNewConfirm');
        browser.setValue('#formControlsCurrent', newPassword);
        browser.setValue('#formControlsNew', oldPassword);
        browser.setValue('#formControlsNewConfirm', oldPassword);
        browser.click('#submitPwChange');

        //wait for alert to show status
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Changed Password Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);

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
        browser.expect.element('.alert').text.to.equal("Profile Edited Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);

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
        browser.expect.element('#userEmail').text.to.equal("Email: halfway@halfway.com");
        //edit profile dropdown only visible on own profile
        browser.expect.element('#editProfileDropdown').to.be.present;
    },

    'view another profile': (browser) => {
        browser.click("#settings");
        //wait for the search results to come in
        browser.pause(5000);
        browser.waitForElementPresent('#searchUsers', 5000);
        //search for user
        browser.setValue('#searchUsers', "Polly");
        browser.click('.list-group-item');
        //wait for profile to change then check values
        browser.pause(1000);
        browser.expect.element('#userDisplay').text.to.equal('Display Name: Pollyanna');
        browser.expect.element('#userType').text.to.equal("User Role: mentor");
        //email and edit profile dropdown should not be present
        browser.expect.element('#userEmail').to.not.be.present;
        browser.expect.element('#editProfileDropdown').to.not.be.present;
    },

    'edit profile (no password)': (browser) => {
        browser.click('#settings');

        //edit profile
        browser.click('#editProfileDropdown');
        browser.click('#editProfile');
        browser.setValue('input[type="file"]', require('path').resolve('/home/gabrielle/Dropbox/badsanta.jpg'));
        browser.clearValue('#formControlsProfileName');
        browser.setValue('#formControlsProfileName', newDisplay);
        browser.click('#submitProfile');

        //wait for alert to display message
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Enter your current password!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'edit profile (wrong password)': (browser) => {
        browser.click('#settings');

        //edit profile
        browser.click('#editProfileDropdown');
        browser.click('#editProfile');
        browser.setValue('input[type="file"]', require('path').resolve('/home/gabrielle/Dropbox/badsanta.jpg'));
        browser.clearValue('#formControlsProfileName');
        browser.setValue('#formControlsProfileName', newDisplay);
        browser.click('#submitProfile');

        //wait for alert to display message
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Invalid Password!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'edit profile success': (browser) => {
        browser.click("#settings");
        //edit profile
        browser.click('#editProfileDropdown');
        browser.click('#editProfile');
        browser.setValue('input[type="file"]', require('path').resolve('/home/gabrielle/Dropbox/badsanta.jpg'));
        browser.clearValue('#formControlsProfileName');
        browser.setValue('#formControlsProfileName', newDisplay);
        browser.setValue('#formControlsConfirmPassword', oldPassword);
        browser.click('#submitProfile');

        //wait for alert to display message
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Profile Edited Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'change password empty fields': (browser) => {
        //get to change password screen
        browser.click('#settings');
        browser.click('#editProfileDropdown');
        browser.click('#changePassword');

        //fill out form and submit
        browser.setValue('#formControlsCurrent', oldPassword);
        browser.setValue('#formControlsNew', newPassword);
        browser.click('#submitPwChange');

        //wait for alert to show status
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more fields are empty!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'change password no match': (browser) => {
        //get to change password screen
        browser.click('#settings');
        browser.click('#editProfileDropdown');
        browser.click('#changePassword');

        //fill out form and submit
        browser.setValue('#formControlsCurrent', oldPassword);
        browser.setValue('#formControlsNew', newPassword);
        browser.setValue('#formControlsNewConfirm', "trashpw");
        browser.click('#submitPwChange');

        //wait for alert to show status
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("New Password Fields Don't Match!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'change password too weak': (browser) => {
        //get to change password screen
        browser.click('#settings');
        browser.click('#editProfileDropdown');
        browser.click('#changePassword');

        //fill out form and submit
        browser.clearValue('#formControlsNew');
        browser.clearValue('#formControlsNewConfirm');
        browser.setValue('#formControlsCurrent', oldPassword);
        browser.setValue('#formControlsNew', "tra12");
        browser.setValue('#formControlsNewConfirm', "tra12");
        browser.click('#submitPwChange');

        //wait for alert to show status
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("Weak Password! Check above rules and try again.");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'change password wrong current': (browser) => {
        //get to change password screen
        browser.click('#settings');
        browser.click('#editProfileDropdown');
        browser.click('#changePassword');

        //fill out form and submit
        browser.clearValue('#formControlsCurrent')
        browser.clearValue('#formControlsNew');
        browser.clearValue('#formControlsNewConfirm');
        browser.setValue('#formControlsCurrent', "funky");
        browser.setValue('#formControlsNew', newPassword);
        browser.setValue('#formControlsNewConfirm', newPassword);
        browser.click('#submitPwChange');

        //wait for alert to show status
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Invalid Current Password!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'change password success': (browser) => {
        //get to change password screen
        browser.click('#settings');
        browser.click('#editProfileDropdown');
        browser.click('#changePassword');

        //fill out form and submit
        browser.clearValue('#formControlsCurrent')
        browser.clearValue('#formControlsNew');
        browser.clearValue('#formControlsNewConfirm');
        browser.setValue('#formControlsCurrent', oldPassword);
        browser.setValue('#formControlsNew', newPassword);
        browser.setValue('#formControlsNewConfirm', newPassword);
        browser.click('#submitPwChange');

        //wait for alert to show status
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Changed Password Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'restore profile': (browser) => {
        
    }
}