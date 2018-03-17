module.exports = {
    'log on to site and view forum threads': (browser) => {
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        browser.setValue('input[name="username"]', "jessie4life");
        browser.setValue('input[name="password"]', "password");
        browser.click('#loginButton');
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server

        browser.expect.element('#forumHeader').to.be.present;
    },

    'create new forum thread with empty title': (browser) => {
        browser.expect.element('#createThread').to.be.present;
        browser.click('#createThread');

        browser.waitForElementPresent('.modal-title', 200);
        browser.expect.element('.modal-title').text.to.equal("Create New Thread!");

        browser.clearValue('#formControlsSubject');
        browser.setValue('#formControlsMessage', "Hey there this is Selenium creating a thread. Say 'hi' to the latest robot in town!");

        browser.click('.btn-primary');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more required fields are empty.");
    },

    /*'create new forum thread with empty message': (browser) => {
        browser.waitForElementPresent('.modal-title', 200);
        browser.expect.element('.modal-title').text.to.equal("Create New Thread!");

        browser.setValue('#formControlsSubject', "Nightwatch: New Thread!");
        browser.clearValue('#formControlsMessage');

        browser.click('.btn-primary');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more required fields are empty.");
    },*/

    'create new forum thread success': (browser) => {
        browser.waitForElementPresent('.modal-title', 200);
        browser.expect.element('.modal-title').text.to.equal("Create New Thread!");

        browser.setValue('#formControlsSubject', "Nightwatch: New Thread!");
        browser.clearValue('#formControlsMessage');
        browser.setValue('#formControlsMessage', "Hey there this is Selenium creating a thread. Say 'hi' to the latest robot in town!");

        browser.click('.btn-primary');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("Created Thread Successfully!");
    },

    'verify created thread is shown at top of list': (browser) => {
        //expects new thread to be at the top. Will need to re-write when thread priority is implemented
        browser.expect.element('#thread_0').to.be.present;
        browser.expect.element('#thread_0').text.to.contain("Nightwatch: New Thread!");
        browser.expect.element('#thread_0').text.to.contain("Hey there this is Selenium creating a thread. Say 'hi' to the latest robot in town!");
    
        browser.end();
    },

    'view forum thread (no comments present)': (browser) => {
        //pull up created thread with no comments
    },

    'add comment on forum thread': (browser) => {
        //add first comment on thread
    },

    'edit your own thread post': (browser) => {
        //click the edit button to change the message
    },

    'edit your comment on thread post': (browser) => {
        //edit the comment you added two tests earlier
    },

    'delete your comment on thread post': (browser) => {
        //delete the comment you just edited
    },

    'delete your own thread': (browser) => {
        //delete the thread you created on test two of this suite

        //browser.end()
    }
}