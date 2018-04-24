module.exports = {
    before: (browser) => {
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "halfway@halfway.com");
        browser.setValue('input[name="password"]', "Password1!");
        browser.click('#loginButton');
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server
    },

    beforeEach : (browser) => {
		//console.log("refreshing window!");
		browser.refresh();
		browser.timeoutsImplicitWait(10000);
    },

    after: (browser) => {
        //log out and end the session
        browser.click('a[href="/logout"]');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
		browser.end();
    },
    
    'navigate to resources page': (browser) => {
        browser.waitForElementPresent('#resources', 500);
        browser.click('#resources');
        browser.waitForElementPresent('.brandResources', 500);
    },

    'navigate panels': (browser) => {
        //browser.expect.element('.in #resources-list-body-1').to.be.present;
        //browser.assert.attributeEquals("#resources-list-body-1", "aria-expanded", "true");
        browser.waitForElementPresent('#resources-list-heading-2', 2000);

        browser.click('#resources-list-heading-2');
        browser.pause(1000);
        browser.assert.attributeEquals("#resources-list-body-2", "aria-expanded", "true");
        //browser.waitForElementPresent('.in #resources-list-body-2', 500);

        browser.click('#resources-list-heading-5');
        //browser.waitForElementPresent('.in resource-list-body-5', 500);
        browser.pause(1000);
        browser.assert.attributeEquals("#resources-list-body-5", "aria-expanded", "true");

        browser.click('#resources-list-heading-3');
        //browser.waitForElementPresent('.in resources-list-body-3', 500);
        browser.pause(1000);
        browser.assert.attributeEquals("#resources-list-body-3", "aria-expanded", "true");

        browser.click('#resources-list-heading-1');
        //browser.waitForElementPresent('.in resources-list-body-1', 500);
        browser.pause(1000);
        browser.assert.attributeEquals("#resources-list-body-1", "aria-expanded", "true");

        browser.click('#resources-list-heading-4');
        //browser.waitForElementPresent('.in resource-list-body-4', 500);
        browser.pause(1000);
        //browser.assert.cssClassPresent('#resources-list-body-4', 'in');
        browser.assert.attributeEquals("#resources-list-body-4", "aria-expanded", "true");
    },

    'add resource with empty field': (browser) => {
        browser.click("#addFoodResource");
        browser.waitForElementPresent('#.modal-title', 2000);
        browser.setValue('#formControlsSubject', "Good Coupons");
        browser.clearValue('#formControlsMessage', "");
        browser.click('#addFoodResource');
        browser.wait(5000);
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("One or more required fields are blank.")
            browser.acceptAlert();
        });
    },

    'add resource success': (browser) => {
        browser.setValue('#formControlsSubject', "at Aldi's!");
        browser.setValue('#formControlsMessage', "Check your local newspaper for details!");
        browser.click('#addFoodResource');
        browser.wait(5000);
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Resource Posted Successfully!")
            browser.acceptAlert();
        });
    },

    'remove resource': (browser) => {
        browser.waitForElementPresent('#delResource4-0');
        browser.click('#delResource4-0');
        browser.wait(5000);
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Resource removed succesfully! Refresh to see changes.")
            browser.acceptAlert();
        });
    }
}