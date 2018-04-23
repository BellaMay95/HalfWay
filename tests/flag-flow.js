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

    
}