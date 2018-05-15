module.exports = {
    before: (browser) => {
        //launch browser
        browser.url(browser.launchUrl).assert.urlEquals('http://localhost:3000/login'); //change for prod server
        //login to website
        browser.waitForElementPresent('input[name="email"]', 5000);
        browser.setValue('input[name="email"]', "halfway@halfway.com");
        browser.setValue('input[name="password"]', "Password1!");
        browser.click('#loginButton');
        //give time for page to load and login
        browser.pause(3000);
        browser.assert.urlEquals('http://localhost:3000/'); //change for prod server

        //add a thread to flag/handle
        browser.expect.element('#createThread').to.be.present;
        browser.click('#createThread');
        browser.waitForElementPresent('.modal-title', 2000);
        browser.expect.element('.modal-title').text.to.equal("Create New Thread!");
        browser.setValue('#formControlsSubject', "Nightwatch: Please Flag Me!");
        browser.clearValue('#formControlsMessage');
        browser.setValue('#formControlsMessage', "This is an awful forum post!");
        browser.click('.btn-primary');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("Thread Posted Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);

        //add a comment on the created thread to flag/handle
        browser.click('#newCommentThread0');
        browser.setValue('#formControlsTextarea', "This is an inappropriate comment!!");
        browser.click('#createComment');

        browser.waitForElementPresent('.alert', 10000);
        browser.expect.element('.alert').text.to.equal("Comment Posted Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);
        //change when bootstrap implementation changes
        /*browser.pause(3000); //make sure alert has time to show
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Comment Posted Successfully!")
            browser.acceptAlert();
            console.log("accepted alert");
            return;
        });*/
    },

    beforeEach : function(browser) {
		//console.log("refreshing window!");
		browser.refresh();
		browser.timeoutsImplicitWait(10000);
    },

    after: (browser) => {
        //log out and end the session
        browser.waitForElementPresent('#logout', 10000);
        browser.click('#logout');
		browser.assert.urlEquals('http://localhost:3000/logout');
		browser.pause(1000);
		browser.assert.urlEquals('http://localhost:3000/login');
		browser.end();
    },

    'flag created post with empty reason': (browser) => {
        console.log("flagging post with empty reason")
        browser.click("#flagPost0");
        browser.waitForElementPresent('.modal-title', 5000);
        browser.click('#flagPostNow');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more required fields are empty.");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'flag created post successfully': (browser) => {
        console.log("flagging post success")
        browser.click("#flagPost0");
        browser.waitForElementPresent('.modal-title', 5000);
        browser.setValue("#formControlsTextarea", "inappropriate post!");
        browser.click('#flagPostNow');
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("Flagged Forum Post!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'verify post is marked as flagged on forum': (browser) => {
        //functionality coming later
        console.log("verifying post later")
    },

    'view flagged post on admin panel': (browser) => {
        console.log("checking flagged post on admin")
        browser.click('#admin');
        browser.waitForElementPresent('.brandAdmin', 2000);

        browser.expect.element('#flagPost0').text.to.contain("This is an awful forum post!");
        browser.expect.element('#flagPost0').text.to.contain("inappropriate post!");
    },

    'flag created post with empty reason': (browser) => {
        console.log("flagging post with empty reason")
        browser.click('#forum');
        console.log("clicked on forum")
        browser.waitForElementPresent('.brandForum', 2000);

        console.log("viewing comment")
        browser.click('#viewCommentThread0');
        browser.waitForElementPresent('.modal-title', 2000);
        browser.click('#flagComment0');
        browser.click('#flagCommentNow');
        browser.waitForElementPresent('.alert', 2000);
        browser.expect.element('.alert').text.to.equal("One or more required fields are empty.");
        browser.waitForElementNotPresent('.alert', 5000);
        //console.log("finished empty part")
    },

    'flag comment on created post': (browser) => {
        browser.click('#forum');
        browser.waitForElementPresent('.brandForum', 2000);

        console.log("starting next part")
        browser.click('#viewCommentThread0');
        browser.waitForElementPresent('.modal-title', 2000);
        browser.click('#flagComment0');
        browser.setValue('#formControlsTextarea', "inappopriate comment!");
        browser.click('#flagCommentNow');
        console.log("submitted flagged comment");

        /*browser.pause(3000);
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Comment Flagged Successfully!")
            browser.acceptAlert();
            console.log("accepted alert");
            return;
        });*/
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("Comment Flagged Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'verify post is marked as flagged on forum': (browser) => {
        //functionality coming later
        console.log("skipping verify");
    },

    'view flagged comment on admin panel': (browser) => {
        browser.click('#admin');
        browser.waitForElementPresent('.brandAdmin', 2000);

        browser.expect.element('#flagComment0').text.to.contain("This is an inappropriate comment!!");
        browser.expect.element('#flagComment0').text.to.contain("inappopriate comment!");
    },

    'accept comment on flagged post': (browser) => {
        browser.click('#admin');
        browser.waitForElementPresent('.brandAdmin', 2000);
        browser.click('#acceptComment0');
        /*browser.pause(3000);
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Removed Flag from Comment!")
            browser.acceptAlert();
            console.log("accepted alert");
            return;
        });*/
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("Removed Flag from Comment!");
        browser.waitForElementNotPresent('.alert', 5000);
    },

    'verify comment is no longer flagged': (browser) => {
        //functionality coming later

        //re-flag comment
        browser.click('#viewCommentThread0');
        browser.waitForElementPresent('.modal-title', 2000);
        browser.click('#flagComment0');
        browser.setValue('#formControlsTextarea', "inappopriate comment!");
        browser.click('#flagCommentNow');
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("Comment Flagged Successfully!");
        browser.waitForElementNotPresent('.alert', 5000);
        /*browser.pause(3000);
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Comment Flagged Successfully!")
            browser.acceptAlert();
            console.log("accepted alert");
            return;
        });*/
    },

    'reject comment on flagged post': (browser) => {
        browser.click("#admin");
        browser.waitForElementPresent('.brandAdmin', 2000);

        browser.click('#rejectComment0');
        /*browser.pause(3000);
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Comment Removed Successfully!")
            browser.acceptAlert();
            console.log("accepted alert");
            return;
        });*/
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("Comment Removed Successfully!");
        brower.waitForElementNotPresent('.alert', 5000);
    },

    'verify comment is removed from post': (browser) => {
        browser.click('#forum');
        browser.waitForElementPresent('.brandForum', 2000);

        browser.click('#viewCommentThread0');
        browser.waitForElementPresent('.modal-title', 2000);

        //browser.expect.element('comment0').text.to.not.contain("This is an inappropriate comment!!");
        browser.expect.element('comment0').to.not.be.present;
    },

    'accept flagged post': (browser) => {
        browser.click('#admin');
        browser.waitForElementPresent('.brandAdmin', 2000);

        browser.click('#acceptPost0');
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("Removed Flag from Post!");
        browser.waitForElementNotPresent('.alert');
        /*browser.pause(3000);
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Removed Flag from Post!")
            browser.acceptAlert();
            console.log("accepted alert");
            return;
        });*/
    },

    'verify post is no longer flagged': (browser) => {
        //functionality coming later

        //re-flag post
        browser.click('#forum');
        browser.waitForElementPresent('.brandForum', 2000);
        browser.click("#flagPost0");
        browser.waitForElementPresent('.modal-title', 5000);
        browser.setValue("#formControlsTextarea", "inappropriate post!");
        browser.click('#flagPostNow');
    },

    'reject flagged post': (browser) => {
        browser.click('#admin');
        browser.waitForElementPresent('.brandAdmin', 2000);

        browser.click('#rejectPost0');
        browser.waitForElementPresent('.alert', 5000);
        browser.expect.element('.alert').text.to.equal("Removed Post Successfully!");
        browser.waitForElementNotPresent('.alert');
        /*browser.pause(3000);
        browser.getAlertText((text) => {
            console.log(text);
            let message = text.value;
            //browser.expect.message.to.equal("Removed Post Successfully!")
            browser.acceptAlert();
            console.log("accepted alert");
            return;
        });*/
    },

    'verify post is removed from forum': (browser) => {
        browser.waitForElementPresent('#forum', 10000)
        browser.click('#forum');
        browser.waitForElementPresent('.brandForum', 2000);

        browser.expect.element('#thread0').text.to.not.contain("Nightwatch: Please Flag Me!");
        browser.expect.element('#thread0').text.to.not.contain("This is an awful forum post!");
    }
}