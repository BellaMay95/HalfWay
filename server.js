const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
	console.log(req.body);
	let user = req.body.user;
	let password = req.body.password;
	if (user === "halfway@gmail.com" && password === "password") {
		console.log("success!");
		let name = "Jane";
		res.send({ result: true, name: name });
	}
	else {
		console.log("fail!");
		res.send({ result: false });
	}
	//res.send({ express: 'Hello From Express' });
});