module.exports = {
    'log on to site': (browser) => {
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        browser.setValue('input[name="username"]', "jessie4life");
        browser.setValue('input[name="password"]', "password");
        browser.click('#loginButton');
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server
    },
    
    'navigate to resources page': (browser) => {
        browser.waitForElementPresent('#resources', 500);
        browser.click('#resources');
        browser.waitForElementPresent('#resourcesHeader', 500);
    },

    'navigate panels': (browser) => {
        //browser.expect.element('.in #resources-list-body-1').to.be.present;
        browser.assert.cssClassPresent('#resources-list-body-1', 'in');

        browser.click('#resources-list-heading-2');
        browser.pause(1000);
        browser.assert.cssClassPresent('#resources-list-body-2', 'in');
        //browser.waitForElementPresent('.in #resources-list-body-2', 500);

        browser.click('#resources-list-heading-5');
        //browser.waitForElementPresent('.in resource-list-body-5', 500);
        browser.pause(1000);
        browser.assert.cssClassPresent('#resources-list-body-5', 'in');

        browser.click('#resources-list-heading-3');
        //browser.waitForElementPresent('.in resources-list-body-3', 500);
        browser.pause(1000);
        browser.assert.cssClassPresent('#resources-list-body-3', 'in');

        browser.click('#resources-list-heading-1');
        //browser.waitForElementPresent('.in resources-list-body-1', 500);
        browser.pause(1000);
        browser.assert.cssClassPresent('#resources-list-body-1', 'in');

        browser.click('#resources-list-heading-4');
        //browser.waitForElementPresent('.in resource-list-body-4', 500);
        browser.pause(1000);
        browser.assert.cssClassPresent('#resources-list-body-4', 'in');

        browser.click('#resources-list-heading-4');
        browser.waitForElementNotPresent('.in', 500);
    },

    'edit resources page': (browser) => {
        browser.end();
    }
}