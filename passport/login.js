var LocalStrategy   = require('passport-local').Strategy;
var db = require('./db');
var argon = require('argon2');

module.exports = function(passport){
	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, done) {
            console.log("made it to login function!");
            let username = req.body.user;
            let password = req.body.password;
            // check in mongo if a user with username exists or not
            //User.findOne({ 'username' :  username }, 
            db.users.findByEmail(username,
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, res.send({ result: false }));                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, res.send({ result: false })); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user.name);
                }
            );

        })
    );


    var isValidPassword = function(user, password){
        //return bCrypt.compareSync(password, user.password);
        return argon.verify(user.password, password);
        argon.verify(user.password, password).then(match => {
            if (match) {
              return true;
            } else {
              return false;
            }
        });
    }
    
}