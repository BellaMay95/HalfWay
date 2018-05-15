module.exports = {
    before: (browser) => {
        //launch browser and check url
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        //login to the site
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "halfway@halfway.com");
        browser.setValue('input[name="password"]', "Password1!");
        browser.click('#loginButton');
        //wait enough time to login and check the url to make sure login happened
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server
    },

    beforeEach : (browser) => {
		//refresh browser and wait 10 seconds for everything to load
		browser.refresh();
        browser.timeoutsImplicitWait(10000);
        browser.waitForElementPresent('#admin', 20000);
        browser.click('#admin');
        browser.waitForElementPresent("#select-func", 5000);

        //get to the "manage accounts" from the dropdown
        browser.click('#select-func');
        browser.click('#accounts');
    },

    after: (browser) => {
        //log out and end the session
        browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
		browser.end();
    },

    'navigate to admin panel / manage accounts': (browser) => {
        //click on the admin button on the navbar
        browser.waitForElementPresent('#admin', 5000);
        browser.click('#admin');
        browser.waitForElementPresent("#select-func", 5000);

        //get to the "manage accounts" from the dropdown
        browser.click('#select-func');
        browser.click('#accounts');
        browser.waitForElementPresent('#manage-account-tabs-tab-3', 5000);
    },

    'create new account with empty fields': (browser) => {
        
        //make sure the create account tab is selected
        browser.click('#manage-account-tabs-tab-1');
        browser.waitForElementPresent('#manage-account-tabs-pane-1', 5000);

        //fill in the form and submit
        browser.setValue('#createAccountDisplayName', "");
        browser.setValue('#createAccountEmail', "");
        browser.setValue('#createAccountSelect', "mentor");
        browser.click('#crAccSubmit');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("One or more fields are empty. Please try again.");
        browser.waitForElementNotPresent('.alert', 5000);

        //clear fields to prepare for next test
        browser.clearValue('#createAccountDisplayName');
        browser.clearValue('#createAccountEmail');
    },

    'create new account with invalid email format': (browser) => {
        //fill in the form and submit
        browser.setValue('#createAccountDisplayName', "Isabella Marie");
        browser.setValue('#createAccountEmail', "izzy@y");
        browser.setValue('#createAccountSelect', "mentor");
        browser.setValue('#createAccountPassword', "Password1!");
        browser.click('#crAccSubmit');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("You must enter a valid email address.");
        browser.waitForElementNotPresent('.alert', 5000);

        //clear fields to prepare for next test
        browser.clearValue('#createAccountDisplayName');
        browser.clearValue('#createAccountEmail');
        browser.clearValue('#createAccountPassword');
    },

    'create new account success': (browser) => {
        //fill in the form and submit
        browser.setValue('#createAccountDisplayName', "Isabella Marie");
        browser.setValue('#createAccountEmail', "bibleccountability@gmail.com");
        browser.setValue('#createAccountSelect', "mentor");
        browser.setValue('#createAccountPassword', "Password1!");
        browser.click('#crAccSubmit');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("User Account Created Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'change account type with empty email': (browser) => {
        //navigate to the change account tab
        browser.click('#manage-account-tabs-tab-3');
        browser.waitForElementPresent('#manage-account-tabs-pane-3', 5000);

        //fill in the form and submit
        browser.setValue('#changeAccountEmail', "");
        browser.setValue('#changeAccountSelect', "mentor");
        browser.setValue('#changeAccountPassword', "Password1!");
        browser.click('#chAccSubmit');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("One or more fields are empty. Please try again.");
        browser.waitForElementNotPresent('.alert', 5000);

        //clear fields to prepare for next test
        browser.clearValue('#changeAccountPassword');
    },

    'change account type with invalid email format': (browser) => {
        //fill in the form and submit
        browser.setValue('#changeAccountEmail', "izzy@com");
        browser.setValue('#changeAccountSelect', "mentor");
        browser.setValue('#changeAccountPassword', "Password1!");
        browser.click('#chAccSubmit');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("You must enter a valid email address.");
        browser.waitForElementNotPresent('.alert', 5000);

        //clear fields to prepare for next test
        browser.clearValue('#changeAccountEmail');
        browser.clearValue('#changeAccountPassword');
    },

    'change your own account type': (browser) => {
        //fill in the form and submit
        browser.setValue('#changeAccountEmail', "halfway@halfway.com");
        browser.setValue('#changeAccountSelect', "mentor");
        browser.setValue('#changeAccountPassword', "Password1!");
        browser.click('#chAccSubmit');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("You can't change your own account type!");
        browser.waitForElementNotPresent('.alert', 5000);

        //clear field values to prepare for next test
        browser.clearValue('#changeAccountEmail');
        browser.clearValue('#changeAccountPassword');
    },

    'change account type with invalid email': (browser) => {
        //fill in the form and submit
        browser.setValue('#changeAccountEmail', "izzyleigh35@yahoo.com");
        browser.setValue('#changeAccountSelect', "mentor");
        browser.setValue('#changeAccountPassword', "Password1!");
        browser.click('#chAccSubmit');
        //wait for alert to display wth status
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Failed to find user account!");
        browser.waitForElementNotPresent('.alert', 5000);

        //clear field vlaues to prepare for next test
        browser.clearValue('#changeAccountEmail');
        browser.clearValue('#changeAccountPassword');
    },

    'change account type success': (browser) => {
        //fill in the form and submit
        browser.setValue('#changeAccountEmail', "bibleccountability@gmail.com");
        browser.setValue('#changeAccountSelect', "youth");
        browser.setValue('#changeAccountPassword', "Password1!");
        browser.click('#chAccSubmit');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("User Type Updated Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'delete account with empty field': (browser) => {
        //navigate to tab for delete account
        browser.click('#manage-account-tabs-tab-2');
        browser.waitForElementPresent('#manage-account-tabs-pane-2', 5000);

        //fill in the form and submit
        browser.setValue('#deleteAccountEmail', "");
        browser.setValue('#deleteAccountPassword', "Password1!");
        browser.click('#delAccSubmit');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("One or more fields are empty. Please try again.");
        browser.waitForElementNotPresent('.alert', 5000);

        //clear fields for next test
        browser.clearValue('#deleteAccountEmail');
        browser.clearValue('#deleteAccountPassword');
    },

    'delete account with invalid email format': (browser) => {
        //fill in the form and submit
        browser.setValue('#deleteAccountEmail', "izzy@y");
        browser.setValue('#deleteAccountPassword', "Password1!");
        browser.click('#delAccSubmit');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("You must enter a valid email address.");
        browser.waitForElementNotPresent('.alert', 5000);

        //clear fields for next test
        browser.clearValue('#deleteAccountEmail');
        browser.clearValue('#deleteAccountPassword');
    },

    'delete account with invalid email': (browser) => {
        //fill in the form and submit
        browser.setValue('#deleteAccountEmail', "izzy@yahoo.com");
        browser.setValue('#deleteAccountPassword', "Password1!");
        browser.click('#delAccSubmit');
        //confirm delete on modal
        browser.waitForElementPresent("#confirmDelete", 5000);
        browser.click('#confirmDelete');

        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Account Not Found!");
        browser.waitForElementNotPresent('.alert', 5000);

        //cleart values for next test
        browser.clearValue('#deleteAccountEmail');
        browser.clearValue('#deleteAccountPassword');
    },

    'delete account success': (browser) => {
        //fill in the form and submit
        browser.setValue('#deleteAccountEmail', "bibleccountability@gmail.com");
        browser.setValue('#deleteAccountPassword', "Password1!");
        browser.click('#delAccSubmit');
        //confirm delete on modal
        browser.waitForElementPresent("#confirmDelete", 5000);
        browser.click('#confirmDelete');
        //wait for alert to display with status
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Successfully Deleted User Account!");
        browser.waitForElementNotPresent('.alert', 5000);
    }
}