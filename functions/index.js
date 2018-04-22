const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('requestify');

var serviceAccount = require('./key.json');
var databaseURL = "https://halfway-a067e.firebaseio.com/";  //get URL from config file instead
//var databaseURL = process.env.REACT_APP_FIREBASE_DATABASE;
//var apiKey = process.env.REACT_APP_FIREBASE_KEY;
var apiKey = "AIzaSyAmew8GUz4Bqt9k0jak9BoC3rXn-08Hhdo";


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
});

exports.createAccount = functions.https.onCall((data) => {
    //console.log(data);

    //generate 8-character random password from uppercase letters, lowercase letters, numbers, and some symbols
    var genPwd = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    for(var i = 0; i < 8; i++) {
        genPwd += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    //console.log("password: " + genPwd);

    let newUid;

    return emailExists(data.email)
    .then((result) => {
        if (result) {
            console.log("email already exists!");
            throw new functions.https.HttpsError('aborted', 'An account with this email already exists!');
        }
    })
    .then(() => {
        //console.log("Creating user in Firebase!");
        return admin.auth().createUser({
            "email": data.email,
            "password": genPwd, //make password a randomly generated strong password of 8 characters
            "displayName": data.display
        })
        .catch((err) => {
            console.log("failed to create user!");
            console.log(err);
            throw new functions.https.HttpsError('aborted', "Failed to create user!");
        })
    })
    .then((userRecord) => {
        //console.log("setting custom claims");
        let customClaims = {
            'type': data.type
        }
        return admin.auth().setCustomUserClaims(userRecord.uid, customClaims)
        .catch((err) => {
            console.log("failed to set user roles!");
            console.log(err);
            throw new functions.https.HttpsError('aborted', "Failed to set user role");
        });
    })
    .then(() => {
        //also perhaps a welcome email not just password reset?
        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=" + apiKey;
        let body = {
            requestType: "PASSWORD_RESET",
            email: data.email
        };
        
        return request.post(url, body)
        .then((response) => {
            console.log("sent email!");
            console.log(response);
        })
        .catch((err) => {
            console.log("error sending email!");
            console.log(err);
            throw new functions.https.HttpsError('aborted', 'failed to send verification email!');
        })
    })
    .then(() => {
        return "User Account Created Successfully!";
    })
    .catch((err) => {
        console.log("Internal Error!");
        console.log(err);
        throw new functions.https.HttpsError('aborted', "Server Error! Please Contact Administrator.");
    })
});

exports.changeAccount = functions.https.onCall((data) => {
    //console.log(data);
    return admin.auth().getUserByEmail(data.email) //get user record by username in auth
    .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        let uid = userRecord.uid;
        return uid;
    })
    .then((uid) => {
        let customClaims = {
            'type': data.type
        }
        return admin.auth().setCustomUserClaims(uid, customClaims)
        .then(() => {
            return "User Type Updated Successfully!";
        })
        .catch((err) => {
            console.log("error updating user type");
            console.log(err);
            throw new functions.https.HttpsError('aborted', "Failed to change user role");
        });
    })
    .catch((err) => {
        console.log("couldn't find user account!")
        console.log(err);
        throw new functions.https.HttpsError('aborted', "Failed to find user account!");
    })
});

exports.deleteAccount = functions.https.onCall((data) => {
    return emailExists(data.email) //check if the email exists
    .then((result) => {
        //console.log("checking for email result...");
        if (!result) { //email doesn't exist, set variables and jump to catch block
            console.log("account doesn't exist!");
            throw new functions.https.HttpsError('aborted', "Account Not Found!");
        }
    })
    .then(() => {
        //console.log("get user record for username")
        return admin.auth().getUserByEmail(data.email)
        .catch((error) => {
            console.log("error getting user account");
            console.log(error);
            throw new functions.https.HttpsError('aborted', "Error Finding Account!");
        });
    })
    .then((userdata) => {
        let uid = userdata.uid;
        //console.log("deleting user record in auth...")
        return admin.auth().deleteUser(userdata.uid)
        .then(() => {
            console.log("Successfully deleted account!");
            return "Successfully Deleted User Account!";
        })
        .catch((error) => {
            console.log("error deleting account!")
            console.log(error);
            throw new functions.https.HttpsError('aborted', "Failed to Delete User Account!");
        });
    })
    .catch((err) => {
        if (err.message === "Account Not Found!") {
            console.log("account doesn't exist!");
            throw new functions.https.HttpsError('aborted', "Account Not Found!");
        } else {
            console.log("error somewhere else");
            console.log(err);
            throw new functions.https.HttpsError('aborted', "Server Error. Please Contact Administrator.");
        }
    })
});

var emailExists = (email) => {
    //console.log("email function called!");
    
    return admin.auth().getUserByEmail(email)
    .then((userRecord) => {
        if (userRecord) {
            //true: userRecord exists
            return userRecord;
        } else {
            return false;
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

exports.getUserRecordByUid = functions.https.onCall((data) => {
    let uid = data.uid;

    return admin.auth().getUser(uid)
    .then((user) => {
        //console.log(user);
        let safeUser = {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            creationTime: user.metadata.creationTime
        }
        //console.log(safeUser);
        return safeUser;
    })
    .catch((err) => {
        console.log("couldn't fetch user!");
        console.log(err);
        throw new functions.https.HttpsError('not-found', "Couldn't fetch user details!");
    })
})

exports.saveProfile = functions.https.onCall((data) => {
    let updateError = [];

    //empty promise exists to start the promise chain since I'm not sure which fields are changed yet
    return new Promise(function(resolve, reject) {
        resolve;
    })
    .then(() => {
        //update display name if it's been changed
        if (data.profileName) {
            admin.auth().updateUser(data.uid, {
                displayName: data.profileName
            })
            .catch((err) => {
                console.log("error updating profile name!");
                console.log(err);
                updateError.push("profile name");
            })
        }
    })
    .then(() => {
        //update avatar if it's been changed
        if(data.avatar) {
            admin.auth().updateUser(data.uid, {
                photoURL: data.avatar !== "removed" ? data.avatar : null
            })
            .catch((err) => {
                console.log("error updating avatar!");
                console.log(err);
                updateError.push("avatar");
            })
        }
    })
    .then(() => {
        if (updateError.length === 0) {
            //console.log("successfully updated profile!");
            return admin.database().ref('pendingProfiles/' + data.uid).set({})
            .then(() => {
                let result = {
                    success: true,
                    message: "Successfully Updated User Profile!"
                }
                return result;
            })
            .catch((err) => {
                console.log("error deleting pending entry!");
                console.log(err);
                throw new functions.https.HttpsError('aborted', 'failed to delete pending entry');
            })
        } else {
            let message = "Error updating ";
            for (let i=0; i < updateError.length; i++) {
                message += ", ";
                if (i === (updateError.length - 2)) {
                    message += "and ";
                }
                message += updateError[i];
            }
            message += "!";
            console.log(message);
            throw new functions.https.HttpsError('aborted', message);
        }
    })
    .catch((err) => {
        console.log("an empty promise can't possibly cause problems!");
        console.log(err);
    })
});

exports.userList = functions.https.onCall(() => {
    return listAllUsers([])
    .then((userList) => {
        //console.log(userList);
        return userList;
    })
    .catch((err) => {
        console.log("error getting userList!");
        console.log(err);
        return [];
    })
});

function listAllUsers(userList, nextPageToken) {
    // List batch of users, 1000 at a time.
    return admin.auth().listUsers(1000, nextPageToken)
    .then(function(listUsersResult) {
        //console.log("finished finding users! Adding to the list...");
        listUsersResult.users.forEach(function(userRecord) {
            //console.log(userRecord);
            userList.push({ 
                uid: userRecord.uid,
                displayName: userRecord.displayName,
                creationTime: userRecord.metadata.creationTime,
                type: userRecord.customClaims
            });
        });
        if (listUsersResult.pageToken) {
            // List next batch of users.
            return listAllUsers(userList, listUsersResult.pageToken)
        } else {
            //console.log(userList);
            return userList;
        }
    })
    .catch(function(error) {
        console.log("Error listing users:", error);
        return [];
    });
}