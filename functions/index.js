const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

/*const cors = require('cors')({
    origin: true,
});*/

const app = express();
const bodyParser = require('body-parser');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());
//app.use(cors);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var serviceAccount = require('./key.json');
//var config = require('../src/base');
var databaseURL = "https://halfway-a067e.firebaseio.com/";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

//admin.initializeApp(functions.config().firebase);

//exports.createAccount = functions.https.onRequest((req, res) => {
app.post('/createAccount', (req, res) => {
    //console.log(req);
    let data = JSON.parse(req.body);
    let email = data.username + "@halfway.com";
    console.log(data);
    admin.auth().createUser({
        "email": email,
        "password": "password",
        "displayName": data.display,
    })
    .then(function(userRecord) {
        let uid = userRecord.uid;
        let userdata = {
            email: data.email,
            type: data.type
        }
        admin.database().ref('users/' + uid).set(userdata)
        .then(() => {
            console.log("Created user successfully!");
            res.send({"message": "Created user successfully!", "success": true });
        })
        .catch((err) => {
            console.log("Error saving additional details to database!");
            res.send({"message": "Error setting account details!", "success": false });
        })
    })
    .catch(function(error) {
        console.log("Error creating new user: " + error);
        res.send({"message": "Error Creating Account in Auth!", "success": false });
    });
});

app.post('/changeAccount', (req, res) => {
    let data = JSON.parse(req.body);
    console.log(data);
    let email = data.username + "@halfway.com";

    admin.auth().getUserByEmail(email)
    .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
        let uid = userRecord.uid;
        admin.database().ref('users/' + uid).update({type: data.type})
        .then(() => {
            console.log("Updated user type successfully!");
            res.send({"message": "Updated user account type successfully!", "success": true });
        })
        .catch((err) => {
            console.log("Error updating account type: " + error);
            res.send({ "message": "Error updating account type!", "success": false })
        })
    })
    .catch(function(error) {
        console.log("Error fetching user data:", error);
        res.send({ "message": "Error getting initial user data!", "success": false });
    });
});

exports.app = functions.https.onRequest(app);