module.exports = {
    before: (browser) => {
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "halfway@halfway.com");
        browser.setValue('input[name="password"]', "Password1!");
        browser.click('#loginButton');
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server

        browser.expect.element('.brandForum').to.be.present;
    },
    
    beforeEach : function(browser) {
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
    
    /*'log on to site and view forum threads': (browser) => {
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        browser.setValue('input[name="email"]', "halfway@halfway.com");
        browser.setValue('input[name="password"]', "Password1!");
        browser.click('#loginButton');
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server

        browser.expect.element('.brandForum').to.be.present;
    },*/

    'create new forum thread with empty title': (browser) => {
        browser.expect.element('#createThread').to.be.present;
        browser.click('#createThread');

        browser.waitForElementPresent('.modal-title', 2000);
        browser.expect.element('.modal-title').text.to.equal("Create New Thread!");

        browser.clearValue('#formControlsSubject');
        browser.setValue('#formControlsMessage', "Hey there this is Selenium creating a thread. Say 'hi' to the latest robot in town!");

        browser.click('.btn-primary');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more required fields are empty.");
    },

    /*'create new forum thread with empty message': (browser) => {
        browser.expect.element('#createThread').to.be.present;
        browser.click('#createThread');

        browser.waitForElementPresent('.modal-title', 2000);
        browser.expect.element('.modal-title').text.to.equal("Create New Thread!");

        browser.setValue('#formControlsSubject', "Nightwatch: New Thread!");
        browser.clearValue('#formControlsMessage');

        browser.click('.btn-primary');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more required fields are empty.");
    },*/

    'create new forum thread success': (browser) => {
        browser.expect.element('#createThread').to.be.present;
        browser.click('#createThread');

        browser.waitForElementPresent('.modal-title', 2000);
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
        browser.waitForElementPresent('#thread_0', 1000);
        browser.expect.element('#thread_0').text.to.contain("Nightwatch: New Thread!");
        browser.expect.element('#thread_0').text.to.contain("Hey there this is Selenium creating a thread. Say 'hi' to the latest robot in town!");
    
        //browser.url("http://localhost/logout");
        //browser.pause(1000);
        
    },

    'view forum thread (no comments present)': (browser) => {
        //pull up the thread we just made with no comments
        browser.click('#viewCommentThread0');
        browser.waitForElementPresent('#emptyComments', 5000);

        //to-do: expect prev/next buttons to be disabled/not present
        browser.click('#closeModal'); //close modal
    },

    'add comment on forum thread': (browser) => {
        //add comment on thread we just made
        browser.click('#newCommentThread0');
        browser.setValue('#formControlsTextarea', "Hey this is my first comment ever!!");
        browser.click('#createComment');
        //change when bootstrap implementation changes
        browser.pause(3000); //make sure alert has time to show
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Comment Posted Successfully!")
            browser.acceptAlert();
        });
    },

    'view forum thread (comment(s) present)': (browser) => {
        //view created thread that now has comment(s)
        browser.click('#viewCommentThread0');
        browser.expect.element('#comment0').to.be.present; //at least one comment is present

        //also include navigating "previous" and "next"
 
    },

    /*'edit your own thread post': (browser) => {
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

    }*/
}