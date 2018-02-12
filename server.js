const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const initPassport = require ('./passport/init');
const routes = require('./routes/index')(passport);

const app = express();
app.use(helmet());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);
app.use('/', routes);

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));