module.exports = {
    'log on to site': (browser) => {
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        browser.setValue('input[name="username"]', "halfway");
        browser.setValue('input[name="password"]', "password");
        browser.click('#loginButton');
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server
    },

    'navigate to admin panel / manage accounts': (browser) => {
        browser.waitForElementPresent('#admin', 500);
        browser.click('#admin');
        browser.waitForElementPresent("#select-func", 500);

        browser.click('#select-func');
        browser.click('#accounts');
        browser.waitForElementPresent('#manage-account-tabs-tab-3', 500);
    },

    'create new account with empty fields': (browser) => {
        browser.click('#manage-account-tabs-tab-1');
        browser.waitForElementPresent('#manage-account-tabs-pane-1', 500);

        browser.setValue('#createAccountUserName', "izzyleigh");
        browser.setValue('#createAccountDisplayName', "");
        browser.setValue('#createAccountEmail', "");
        browser.setValue('#createAccountSelect', "mentor");
        browser.click('#crAccSubmit');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more fields are empty. Please try again.");
        browser.waitForElementNotPresent('.alert', 5000);

        browser.clearValue('#createAccountUserName');
        browser.clearValue('#createAccountDisplayName');
        browser.clearValue('#createAccountEmail');
    },

    'create new account with invalid email': (browser) => {
        browser.setValue('#createAccountUserName', "izzyleigh");
        browser.setValue('#createAccountDisplayName', "Isabella Marie");
        browser.setValue('#createAccountEmail', "izzy@y");
        browser.setValue('#createAccountSelect', "mentor");
        browser.click('#crAccSubmit');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("You must enter a valid email address.");
        browser.waitForElementNotPresent('.alert', 5000);

        browser.clearValue('#createAccountUserName');
        browser.clearValue('#createAccountDisplayName');
        browser.clearValue('#createAccountEmail');
    },

    'create new account success': (browser) => {
        browser.setValue('#createAccountUserName', "izzyleigh");
        browser.setValue('#createAccountDisplayName', "Isabella Marie");
        browser.setValue('#createAccountEmail', "izzy1234@yahoo.com");
        browser.setValue('#createAccountSelect', "mentor");
        browser.click('#crAccSubmit');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Created Account!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'change account type with empty username': (browser) => {
        browser.click('#manage-account-tabs-tab-3');
        browser.waitForElementPresent('#manage-account-tabs-pane-3', 500);

        browser.setValue('#changeAccountUserName', "");
        browser.setValue('#changeAccountSelect', "mentor");
        browser.click('#chAccSubmit');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more fields are empty. Please try again.");
        browser.waitForElementNotPresent('.alert', 5000);

        browser.clearValue('#changeAccountUserName');
    },

    'change account type success': (browser) => {
        browser.setValue('#changeAccountUserName', "izzyleigh");
        browser.setValue('#changeAccountSelect', "youth");
        browser.click('#chAccSubmit');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Changed Account Type!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'delete account with empty field': (browser) => {
        browser.click('#manage-account-tabs-tab-2');
        browser.waitForElementPresent('#manage-account-tabs-pane-2', 500);

        browser.setValue('#deleteAccountUserName', "izzyleigh");
        browser.setValue('#deleteAccountEmail', "");
        browser.click('#delAccSubmit');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more fields are empty. Please try again.");
        browser.waitForElementNotPresent('.alert', 5000);

        browser.clearValue('#deleteAccountUserName');
        browser.clearValue('#deleteAccountEmail');
    },

    'delete account with invalid email format': (browser) => {
        browser.setValue('#deleteAccountUserName', "izzyleigh");
        browser.setValue('#deleteAccountEmail', "izzy@y");
        browser.click('#delAccSubmit');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("You must enter a valid email address.");
        browser.waitForElementNotPresent('.alert', 5000);

        browser.clearValue('#deleteAccountUserName');
        browser.clearValue('#deleteAccountEmail');
    },

    'delete account with invalid username': (browser) => {
        browser.setValue('#deleteAccountUserName', "izzy");
        browser.setValue('#deleteAccountEmail', "izzy1234@yahoo.com");
        browser.click('#delAccSubmit');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Could not find an account with that username. Please try again.");
        browser.waitForElementNotPresent('.alert', 5000);

        browser.clearValue('#deleteAccountUserName');
        browser.clearValue('#deleteAccountEmail');
    },

    'delete account with invalid email': (browser) => {
        browser.setValue('#deleteAccountUserName', "izzyleigh");
        browser.setValue('#deleteAccountEmail', "izzy@yahoo.com");
        browser.click('#delAccSubmit');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Could not find an account linked to that email. Please try again.");
        browser.waitForElementNotPresent('.alert', 5000);

        browser.clearValue('#deleteAccountUserName');
        browser.clearValue('#deleteAccountEmail');
    },

    'delete account success': (browser) => {
        browser.setValue('#deleteAccountUserName', "izzyleigh");
        browser.setValue('#deleteAccountEmail', "izzy1234@yahoo.com");
        browser.click('#delAccSubmit');
        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Deleted Account Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);

       // browser.url("http://localhost/logout");
       // browser.pause(1000);
        browser.end();
    }
}