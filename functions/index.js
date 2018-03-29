const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());
//app.use(cors);

//restrict this to same domain when moving to prod
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var serviceAccount = require('./key.json');
var databaseURL = "https://halfway-a067e.firebaseio.com/";  //get URL from config file instead
//var databaseURL = process.env.REACT_APP_FIREBASE_DATABASE;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

//admin.initializeApp(functions.config().firebase);

//exports.createAccount = functions.https.onRequest((req, res) => {
app.post('/createAccount', (req, res) => {
    let data = JSON.parse(req.body);
    let message = "", success = false;
    let userdata = {
        email: data.email,
        type: data.type
    };
    let newRecord;

    emailExists(data.email) //calls functiont to check if email is already linked to account
    .then((result) => {
        console.log("checking for email result...");
        if (result) {   //if email exists, set the variables and go to catch block
            message = "Email already exists!";
            success = false;
            console.log(message);
            throw message;
        }
    })
    .then(() => { //calls function to check if username already exists
        return usernameExists(data.username)
    })
    .then((result) => {
        console.log("checking for username result...");
        if (result) {   //if username exists, set the variables and go to catch block
            message = "Username already exists!";
            success = false;
            throw message;
        }
    })
    .then(() => {   //now, actually create the user in the auth table
        console.log("creating user in firebase");
        return admin.auth().createUser({
            "email": data.username + "@halfway.com",
            "password": "password",
            "displayName": data.display,
        })
        .catch((err) => {
            console.log(err);
            message = "Error creating user!";
            success = false;
            throw message;
        })
    })
    .then((userRecord) => {
        console.log("got user record!");
        if (!userRecord) {  //this actually shouldn't run...this should go straight to catch block with error if so
            console.log("Error occurred creating firebase user!");
            message = "Error creating user!";
            success = false;
            throw message;
        }
        newRecord = userRecord; //allows access to userRecord outside of this block
        return true;
    })
    .then(() => {   //now, set user details in database
        return admin.database().ref('users/' + newRecord.uid).set(userdata, (err) => {
            if (err) {  //if error, rollback changes in auth
                console.log("error setting user details! Attempting to roll back changes...");
                message = "error setting user details!"
                success = false;
                //delete user record in auth table to rollback changes
                admin.auth().deleteUser(newRecord.uid)
                .then(function() {
                    console.log("Successfully deleted auth user!");
                    throw message;
                })
                .catch(function(error) { //can't set database or rollback changes? We're in trouble...
                    console.log("Error rolling back changes! Manually check the database...");
                    console.log(error);
                    throw message;
                });
            } else { //last step completed!
                console.log("successfully set user details!");
                message = "Created User Successfully!";
                success = true;
                return true;
            }
        })
    })
    .then(() => { //Yay! We managed to jump through the hoops!
        console.log("successfully created user!");
        res.send({ "message": message, "success": success });
    })
    .catch((err) => {   //a problem happened...just handle stuff and send back to client
        console.log(err);
        res.send({ "message": message, "success": success });
    })
});

app.post('/changeAccount', (req, res) => {
    let data = JSON.parse(req.body);
    let message = "", success = false;

    let email = data.username + "@halfway.com";

    admin.auth().getUserByEmail(email) //get user record by username in auth
    .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        let uid = userRecord.uid;
        return uid;
    })
    .then((uid) => { //then update the type by the gotten UID
        return admin.database().ref('users/' + uid).update({type: data.type})
        .then(() => {   //succeeded, so set variables!
            console.log("Updated user type successfully!");
            message = "Updated User Account Successfully!";
            success = true;
            return message;
        })
        .catch((err) => { //problem updating...nothing to rollback though
            console.log("Error updating account type: " + error);
            message = "Error updating account type!";
            success = false;
            return message;
        });
    })
    .then(() => { //Yay, it worked! Send message back to client
        console.log("finished updating! Sending back to client...");
        res.send({"message": message, "success": success});
    })
    .catch((error) => { //We had problems. Tell the user about them.
        if (error !== "Error updating account type!") { //If it's not this error, then it was a problem getting the initial user record
            console.log("Error fetching user data:", error);
            message = "Error retrieving account!";
            success = false;
        }
        res.send({ "message": message, "success": success });
    });
});

app.post('/deleteAccount', (req, res) => {
    let data = JSON.parse(req.body);
    let message = "", success = false;
    let userEmail = data.username + "@halfway.com";
    let newRecord;

    emailExists(data.email) //check if the email exists
    .then((result) => {
        console.log("checking for email result...");
        if (!result) { //email doesn't exist, set variables and jump to catch block
            message = "Email not valid!";
            success = false;
            console.log(message);
            throw message;
        }
    })
    .then(() => { //check if the username exists
        return usernameExists(data.username)
    })
    .then((result) => {
        console.log("checking for username result...");
        if (!result) { //username doesn't exist so jump to catch block
            message = "Username not valid!";
            success = false;
            throw message;
        }
    })
    .then(() => {   //now actually get the user record based on username
        console.log("get user record for username")
        return admin.auth().getUserByEmail(userEmail)
        .catch((error) => {
            console.log(error);
            message = "Invalid username!";
            success = false;
            throw message;
        });
    })
    .then((userRecord) => {
        console.log("get user record in database")
        newRecord = userRecord; //make user record available outside of this block
        //find userRecord based on UID gotten from username
        return admin.database().ref('users/' + userRecord.uid).once('value')
        .catch((error) => {
            console.log("couldn't retrieve account from UID!");
            console.log(error);
            message = "Failed to delete account!";
            success = false;
            throw message;
        });
    })
    .then((snapshot) => {
        console.log("check if input matches")
        if (!snapshot) {    //no userRecord in database for the given UID!
            console.log("couldn't find database record for the UID");
            message = "Database error! Please contact an administrator!";
            success = false;
            throw message;
        }
        else if (data.email !== snapshot.val().email) { //input for username and email don't match
            console.log("Username and Email don't match!");
            message = "Username and Email don't match! Try again!";
            success = false;
            throw message;
        }
    })
    .then(() => { //now actually delete the user in auth
        console.log("deleting user record in auth...")
        return admin.auth().deleteUser(newRecord.uid)
        .catch((error) => {
            console.log(error);
            message = "Failed to delete user record!";
            success = false;
            throw message;
        });
    })
    .then(() => { //now actually delete the user record in database
        console.log("deleting user record in database...");
        return admin.database().ref('users/' + newRecord.uid).remove()
        .catch((error) => {
            console.log(error);
            message = "Failed to completely delete user! Please contact an administrator!";
            success = false;
            throw message;
        });
    })
    .then(() => {
        console.log("completed successfully!");
        message = "Deleted user successfully!"
        success = true;
        res.send({ "message": message, "success": success });
    })
    .catch((error) => {
        console.log("An error occurred somewhere!");
        res.send({ "message": message, "success": success });
    });
});

var emailExists = (email) => {
    console.log("email function called!");
    
    return new Promise((resolve, reject) => {
        admin.database().ref().child('users').orderByChild('email').equalTo(email).on("value", function(snapshot) {
            //console.log(snapshot.val());
            if (snapshot.val()) {
                //true: email exists
                resolve(true);
            } else {
                //false: email doesn't exist
                resolve(false);
            }
        });
    });   
};

var usernameExists = (username) => {
    console.log("username function called!");
    let email = username + "@halfway.com";
    
    return admin.auth().getUserByEmail(email)
    .then((userRecord) => {
        if (userRecord) {
            //true: userRecord exists
            return userRecord;
        }
    })
    //throws an error if user doesn't exist
    .catch((err) => {
        //console.log(err);
        if (err.errorInfo.code === 'auth/user-not-found') {
            console.log("expected behavior!");
            return false;
        }
        console.log(err);
        return err;
    })
}

exports.app = functions.https.onRequest(app);